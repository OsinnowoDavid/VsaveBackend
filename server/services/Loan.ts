import Loan from "../model/Loan";

import { IUser } from "../../types";
export const createLoanRecord = async (
    user: IUser,
    amount: number,
    interest: number,
    interestPercentage: number,
    status: string,
    startDate: Date,
    dueDate: Date,
    repaymentAmount: number,
    remark?: string,
) => {
    try {
        const newLoan = await Loan.create({
            user,
            amount,
            interest,
            interestPercentage,
            status,
            startDate,
            dueDate,
            repaymentAmount,
            remark,
        });
        return newLoan;
    } catch (err: any) {
        throw err;
    }
};

export const getUserLoanRecord = async (user: IUser) => {
    try {
        const allLoans = await Loan.find({ user: user._id });
        return allLoans;
    } catch (err: any) {
        throw err;
    }
};
export const getUserSettledLoan = async (user: IUser) => {
    try {
        const allLoans = await Loan.find({ user: user._id, isSettled: true });
        return allLoans;
    } catch (err: any) {
        throw err;
    }
};
export const getUserUnsettledLoan = async (user: IUser) => {
    try {
        const loan = await Loan.findOne({
            user: user._id,
            isSettled: false,
        });
        return loan;
    } catch (err: any) {
        throw err;
    }
};

export const payUnsettledLoan = async (user: IUser, amount: number) => {
    try {
        const foundLoanRecord = await getUserUnsettledLoan(user);
        // check if its the exact amount to clear the dept
        if (Number(foundLoanRecord.repaymentAmount) === amount) {
            foundLoanRecord.status = "completed";
            foundLoanRecord.isSettled = true;
            foundLoanRecord.repaymentCompletedDate = new Date();
            foundLoanRecord.remark = `Loan id Completed`;
            foundLoanRecord.repayments.push({
                amount,
                date: new Date(),
            });
            foundLoanRecord.repaymentAmount = 0;
            await foundLoanRecord.save();
            return foundLoanRecord;
        }
        let newRepaymentAmount =
            Number(foundLoanRecord.repaymentAmount) - amount;
        foundLoanRecord.repaymentAmount = Number(newRepaymentAmount);
        foundLoanRecord.repayments.push({
            amount,
            date: new Date(),
        });
        await foundLoanRecord.save();
        return foundLoanRecord;
    } catch (err: any) {
        throw err;
    }
};

export const allUnsettledRecord = async () => {
    try {
        const allUnsettledLoan = await Loan.find({
            isSettled: false,
        });
        return allUnsettledLoan;
    } catch (err: any) {
        throw err;
    }
};
