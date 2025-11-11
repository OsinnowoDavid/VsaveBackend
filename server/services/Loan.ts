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
        const allLoans = await Loan.findOne({
            user: user._id,
            isSettled: false,
        });
        return allLoans;
    } catch (err: any) {
        throw err;
    }
};
