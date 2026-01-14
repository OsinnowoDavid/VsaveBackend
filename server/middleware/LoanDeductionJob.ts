import { IUser } from "../../types";
import {
    payUnsettledLoan,
    getUserUnsettledLoan,
    allUnsettledRecord,
} from "../services/Loan";
import { userWithdraw, getUserById } from "../services/User";
import { generateLoanRefrenceCode } from "../config/tools";

const deductLoanRepayment = async (user: string) => {
    try {
        const foundUser = await getUserById(user) as IUser ;
        const foundUnsettledLoan = await getUserUnsettledLoan(foundUser);
        if (!foundUnsettledLoan) {
            return "no unsettled loan";
        }

        let remark = `Loan settlement for outstanding laon`;
        let ref = generateLoanRefrenceCode();
        // deduct loan money from user account
        let withdraw = await userWithdraw(
            foundUser._id.toString(),
            foundUnsettledLoan.repaymentAmount,
            remark,
            ref,
        );
        if (withdraw === "Insufficient Funds") {
            if (Number(foundUser.availableBalance) > 100) {
                let withdraw = await userWithdraw(
                    foundUser._id.toString(),
                    foundUser.availableBalance,
                    remark,
                    ref,
                );
                const loanpayment = await payUnsettledLoan(
                    foundUser,
                    foundUser.availableBalance,
                );
                return loanpayment;
            }
            return "Insufficient Funds to settle loan";
        }
        const loanSettled = await payUnsettledLoan(
            foundUser,
            foundUnsettledLoan.repaymentAmount,
        );
        return "Done";
    } catch (err: any) {
        return err.message;
    }
};

export const loanDeductionJob = async () => {
    try {
        const allUnsettledLoan = await allUnsettledRecord();
        for (const record of allUnsettledLoan) {
            const deduction = await deductLoanRepayment(record.user.toString());
            return "done";
        }
        return "done";
    } catch (err: any) {
        return err.message;
    }
};
