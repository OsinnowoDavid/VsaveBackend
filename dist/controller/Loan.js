"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanSettlementController = exports.allUserUnsettledLoanRecord = exports.allUserSettledLoanRecord = exports.allUserLoanRecord = exports.createLoanController = exports.checkElegibilityController = void 0;
const Loan_1 = require("../services/Loan");
const User_1 = require("../services/User");
const Savings_1 = require("../services/Savings");
const tools_1 = require("../config/tools");
const checkElegibilityController = async (req, res) => {
    try {
        const user = req.user;
        let elegibility = {};
        // first check is user createdAt ia more than 3month
        let isMoreThanThreeMonth = (0, tools_1.isOlderThanThreeMonths)(user.createdAt);
        if (!isMoreThanThreeMonth) {
            return res.json({
                status: "Failed",
                message: "User not elegible , you most have used more than three month  and Saved more than 10000N",
            });
        }
        // check if the user have an unsettled loan
        const userUnsettledLoan = await (0, Loan_1.getUserUnsettledLoan)(user);
        if (userUnsettledLoan) {
            return res.json({
                status: "Failed",
                message: `User not elegible , you have an unsettled dept of ${userUnsettledLoan.repaymentAmount} `,
                data: userUnsettledLoan,
            });
        }
        // check if the user have saved up to 5000N in total
        let totalSavings = 0;
        const foundUserSavings = await (0, Savings_1.allUserActiveSavingsRecord)(user);
        for (const record of foundUserSavings) {
            const contributionRecord = await (0, Savings_1.getSavingsContributionById)(record.contributionId.toString());
            for (const contrubution of contributionRecord.record) {
                if (contrubution.status === "paid") {
                    totalSavings += contrubution.amount;
                }
            }
        }
        let stageAndAmount = (0, tools_1.getStageAndMaxAmount)(totalSavings);
        elegibility.stage = stageAndAmount.stage;
        elegibility.maxAmount = stageAndAmount.maxLoan;
        //check if its a Good repayment users
        const allSettledLoan = await (0, Loan_1.getUserSettledLoan)(user);
        let userRateing = (0, tools_1.getUserRating)(allSettledLoan);
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
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.checkElegibilityController = checkElegibilityController;
const calculateInterest = (percentage, amount) => {
    return (percentage / 100) * amount;
};
const addFourteenDays = (startDate) => {
    const start = new Date(startDate);
    const result = new Date(start);
    result.setDate(start.getDate() + 14);
    return result;
};
const createLoanController = async (req, res) => {
    try {
        const { amount, loanTitle, loanElegibilityPass } = req.body;
        const user = req.user;
        const elegibility = req.loanElegibility;
        console.log('elegibility:', elegibility);
        if (!loanElegibilityPass) {
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
            const createdLoan = await (0, Loan_1.createLoanRecord)(user, loanTitle, loanedAmount, interestAmount, interestPercent, "pending", new Date(), dueDate, amount, remark);
            return res.json({
                status: "Pending",
                message: "loan is been processed, needs admin approval",
                data: createdLoan,
            });
        }
        let remark = "loan approved and disbursed";
        const createdLoan = await (0, Loan_1.createLoanRecord)(user, loanTitle, loanedAmount, interestAmount, interestPercent, "approved", new Date(), dueDate, amount, remark);
        await (0, User_1.userDeposit)(user._id.toString(), loanedAmount, (0, tools_1.generateLoanRefrenceCode)(), new Date(), "Vsave Loan", remark, interestAmount);
        return res.json({
            status: "Success",
            message: "loan approved and disbursed",
            data: createdLoan,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createLoanController = createLoanController;
const allUserLoanRecord = async (req, res) => {
    try {
        const user = req.user;
        const allLoanRecord = await (0, Loan_1.getUserLoanRecord)(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allLoanRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.allUserLoanRecord = allUserLoanRecord;
const allUserSettledLoanRecord = async (req, res) => {
    try {
        const user = req.user;
        const allLoanRecord = await (0, Loan_1.getUserSettledLoan)(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allLoanRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.allUserSettledLoanRecord = allUserSettledLoanRecord;
const allUserUnsettledLoanRecord = async (req, res) => {
    try {
        const user = req.user;
        const allLoanRecord = await (0, Loan_1.getUserUnsettledLoan)(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allLoanRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.allUserUnsettledLoanRecord = allUserUnsettledLoanRecord;
const loanSettlementController = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = req.user;
        const settledLoan = await (0, Loan_1.payUnsettledLoan)(user, amount);
        if (!settledLoan.isSettled) {
            // create transaction record 
            let remark = "loan settlement";
            await (0, User_1.userWithdraw)(user._id.toString(), amount, remark, (0, tools_1.generateLoanRefrenceCode)());
            return res.json({
                status: "Success",
                message: `loan almost completed , it remain ${settledLoan.repaymentAmount}N to be settled on or before ${settledLoan.dueDate}`,
                data: settledLoan
            });
        }
        // create transaction record 
        let remark = "loan settlement";
        await (0, User_1.userWithdraw)(user._id.toString(), amount, remark, (0, tools_1.generateLoanRefrenceCode)());
        return res.json({
            status: "Success",
            message: `loan completed`,
            data: settledLoan
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.loanSettlementController = loanSettlementController;
