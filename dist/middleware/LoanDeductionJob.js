"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanDeductionJob = void 0;
const Loan_1 = require("../services/Loan");
const User_1 = require("../services/User");
const tools_1 = require("../config/tools");
const deductLoanRepayment = async (user) => {
    try {
        const foundUser = await (0, User_1.getUserById)(user);
        const foundUnsettledLoan = await (0, Loan_1.getUserUnsettledLoan)(foundUser);
        if (!foundUnsettledLoan) {
            return "no unsettled loan";
        }
        let remark = `Loan settlement for outstanding laon`;
        let ref = (0, tools_1.generateLoanRefrenceCode)();
        // deduct loan money from user account
        let withdraw = await (0, User_1.userWithdraw)(foundUser._id.toString(), foundUnsettledLoan.repaymentAmount, remark, ref);
        if (withdraw === "Insufficient Funds") {
            if (Number(foundUser.availableBalance) > 100) {
                let withdraw = await (0, User_1.userWithdraw)(foundUser._id.toString(), foundUser.availableBalance, remark, ref);
                const loanpayment = await (0, Loan_1.payUnsettledLoan)(foundUser, foundUser.availableBalance);
                return loanpayment;
            }
            return "Insufficient Funds to settle loan";
        }
        const loanSettled = await (0, Loan_1.payUnsettledLoan)(foundUser, foundUnsettledLoan.repaymentAmount);
        return "Done";
    }
    catch (err) {
        return err.message;
    }
};
const loanDeductionJob = async () => {
    try {
        const allUnsettledLoan = await (0, Loan_1.allUnsettledRecord)();
        for (const record of allUnsettledLoan) {
            const deduction = await deductLoanRepayment(record.user.toString());
            return "done";
        }
        return "done";
    }
    catch (err) {
        return err.message;
    }
};
exports.loanDeductionJob = loanDeductionJob;
