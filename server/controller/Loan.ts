import { Request, Response } from "express";
import {
    getUserUnsettledLoan,
    getUserSettledLoan,
    createLoanRecord,
    getUserLoanRecord,
    payUnsettledLoan,
    getLoanById,
    editLoanRecord,
    approveOrRejectLoan,
} from "../services/Loan";
import { IUser } from "../../types";
import { userDeposit ,userWithdraw} from "../services/User";
import {
    getSavingsContributionById,
    allUserActiveSavingsRecord,
} from "../services/Savings";
import {
    isOlderThanThreeMonths,
    getStageAndMaxAmount,
    getUserRating,
    generateLoanRefrenceCode,
} from "../config/tools";
import { createNotification } from "../services/Notification";
export const checkElegibilityController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        let elegibility = {} as any;
        // first check is user createdAt ia more than 3month
        let isMoreThanThreeMonth = isOlderThanThreeMonths(user.createdAt);
        if (!isMoreThanThreeMonth) {
            return res.json({
                status: "Failed",
                message:
                    "User not elegible , you most have used more than three month  and Saved more than 10000N",
            });
        }
        // check if the user have an unsettled loan
        const userUnsettledLoan = await getUserUnsettledLoan(user);
        if (userUnsettledLoan) {
            return res.json({
                status: "Failed",
                message: `User not elegible , you have an unsettled dept of ${userUnsettledLoan.repaymentAmount} `,
                data: userUnsettledLoan,
            });
        }
        // check if the user have saved up to 5000N in total
        let totalSavings = 0;
        const foundUserSavings = await allUserActiveSavingsRecord(user);
        for (const record of foundUserSavings) {
            const contributionRecord = await getSavingsContributionById(
                record.contributionId.toString(),
            );
            for (const contrubution of contributionRecord.record) {
                if (contrubution.status === "paid") {
                    totalSavings += contrubution.amount;
                }
            }
        }
        let stageAndAmount = getStageAndMaxAmount(totalSavings);
        elegibility.stage = stageAndAmount.stage;
        elegibility.maxAmount = stageAndAmount.maxLoan;
        //check if its a Good repayment users
        const allSettledLoan = await getUserSettledLoan(user._id.toString());
        let userRateing = getUserRating(allSettledLoan);
        elegibility.ratingStatus = userRateing.ratingStatus;
        elegibility.interestRate = userRateing.interestRate;
        elegibility.pass = true;
        // let token = req.headers.authorization
        // const newToken = attachToToken(token,elegibility) 
        // res.setHeader("authorization", `${newToken}`);
        return res.json({
            status: "Success",
            message: "elegibility calculated",
            data: elegibility,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
const calculateInterest = (percentage: number, amount: number) => {
    return (percentage / 100) * amount;
};
const addFourteenDays = (startDate: Date) => {
    const start = new Date(startDate);
    const result = new Date(start);
    result.setDate(start.getDate() + 14);
    return result;
};

export const createLoanController = async (req: Request, res: Response) => {
    try {
        const { amount, loanTitle, loanElegibility } = req.body;
        const user = req.user as IUser;
        const elegibility = loanElegibility;
        if (!loanElegibility?.pass) {
            return res.json({
                status: "Failed",
                message: "user not eligible for loan",
            });
        }
        if (Number(amount) > elegibility.maxAmount) {
            return res.json({
                status: "Failed",
                message: "user not elegible for this amount",
            });
        }
        let interestPercent = Number(elegibility.interestRate) * 14;
        let interestAmount = calculateInterest(interestPercent, Number(amount));
        let loanedAmount = Number(amount) - Number(interestAmount);
        let dueDate = addFourteenDays(new Date());

        if (amount > 50000) {
            // craete Loan and put on pending
            let remark = "require admin approval for 50000N loan and above";
            const createdLoan = await createLoanRecord(
                user,
                loanTitle,
                loanedAmount,
                interestAmount,
                interestPercent,
                "pending",
                new Date(),
                dueDate,
                amount,
                remark,
            );
            return res.json({
                status: "Pending",
                message: "loan is been processed, needs admin approval",
                data: createdLoan,
            });
        }
        let remark = "loan approved and disbursed";
        const createdLoan = await createLoanRecord(
            user,
            loanTitle,
            loanedAmount,
            interestAmount,
            interestPercent,
            "approved",
            new Date(),
            dueDate,
            amount,
            remark,
        );
        await userDeposit(
            user._id.toString(),
            loanedAmount,
            generateLoanRefrenceCode(),
            new Date(),
            "Vsave Loan",
            remark,
            interestAmount,
        );
        return res.json({
            status: "Success",
            message: "loan approved and disbursed",
            data: createdLoan,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const allUserLoanRecord = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const allLoanRecord = await getUserLoanRecord(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allLoanRecord,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const allUserSettledLoanRecord = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const allLoanRecord = await getUserSettledLoan(user._id.toString());
        return res.json({
            status: "Success",
            message: "all record found",
            data: allLoanRecord,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const allUserUnsettledLoanRecord = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const allLoanRecord = await getUserUnsettledLoan(user); 
        return res.json({
            status: "Success",
            message: "all record found",
            data: allLoanRecord,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const editLoanForApprovalController = async ( req: Request, res: Response,) =>{
    try{
        const {id, amount,loanDuration} = req.body ; 
        const foundLoan = await getLoanById(id) ;
        const allSettledLoan = await getUserSettledLoan(foundLoan.user.toString());
        let userRateing = getUserRating(allSettledLoan);
        let interestPercentage = Number (userRateing.interestRate) * Number(loanDuration) ;
        let interestAmount = calculateInterest(interestPercentage, amount) ; 
        let loanedAmount =  Number(amount) - Number(interestAmount); 
        let endDate = new Date();
            endDate.setDate(new Date().getDate() + Number(loanDuration));
        const editLoan = await editLoanRecord(foundLoan._id.toString(),loanedAmount,interestAmount, interestPercentage,amount, new Date(), loanDuration,endDate,"Loan approved and disbursed !") ; 
       // credit account 
       await userDeposit(foundLoan.user.toString(),loanedAmount, generateLoanRefrenceCode(),new Date(),"VSave","approved loan disbursment")
       // send notification 
       let notificationTitle = "Loan Approval" ;
       let notificationMessage = `
       your loan was approved and disbursed but was edited for some reasons 
       approved loan is ${editLoan.amount}, to repay ${editLoan.repaymentAmount} on ${editLoan.dueDate} .
       `
        await createNotification("VSAVE-APP",notificationTitle,notificationMessage,"User",editLoan.user.toString(),"sent") ;
        return res.json({
            status:"Success",
            message:"loan approved and edited successfuly",
            data :editLoan
        })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}
// aprovve pending loan
export const approveOrRejectLoanController =  async (
    req: Request,
    res: Response,
) => {
    try{
        const {id, status, duration} = req.body ;
        const dueDate = new Date() ;
         dueDate.setDate(dueDate.getDate() + duration);
        const record = await approveOrRejectLoan(id,status,duration,dueDate) ; 
        if(status === "approved"&& record){
            await userDeposit(record.user.toString(),record.amount,generateLoanRefrenceCode(),new Date(),"Vsave Loan","loan disbursment", ) ; 
             // send notification 
            let notificationTitle = "Loan Approval" ;
            let notificationMessage = `
            your loan was approved and disbursed
            approved loan is ${record.amount}, to repay ${record.repaymentAmount} on ${record.dueDate} .
            `
        await createNotification("VSAVE-APP",notificationTitle,notificationMessage,"User",record.user.toString(),"sent") ;
              return res.json({
            status: "Success",
            message: "record updated , loan was Approved",
            data: record 
        })
        }
         // send notification 
            let notificationTitle = "Loan rejected" ;
            let notificationMessage = `
           Sorry to inform you that your loan was rejected
            `
        await createNotification("VSAVE-APP",notificationTitle,notificationMessage,"User",record.user.toString(),"sent") ;
        return res.json({
            status: "Success",
            message: "record updated , loan was declined",
            data: record 
        })
    }catch(err:any){
        return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
export const loanSettlementController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {amount} = req.body ;
        const user = req.user as IUser ;
        
        const settledLoan = await payUnsettledLoan(user,amount) ;
        if(!settledLoan.isSettled){
              // create transaction record 
               let remark = "loan settlement";
            await userWithdraw(user._id.toString(),amount,remark, generateLoanRefrenceCode()) ;
            return res.json({
                status:"Success",
                message:`loan almost completed , it remain ${settledLoan.repaymentAmount}N to be settled on or before ${settledLoan.dueDate}` ,
                data:settledLoan
            })
        }
        // create transaction record 
         let remark = "loan settlement";
        await userWithdraw(user._id.toString(),amount,remark, generateLoanRefrenceCode()) ;
         return res.json({
                status:"Success",
                message:`loan completed` ,
                data:settledLoan
            })
    }catch(err:any){
        return res.json({
            status: "Failed",
            message: err.message,
        });
    } 
}