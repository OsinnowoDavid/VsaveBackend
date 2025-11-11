"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserUnsettledLoan = exports.getUserSettledLoan = exports.getUserLoanRecord = exports.createLoanRecord = void 0;
const Loan_1 = __importDefault(require("../model/Loan"));
const createLoanRecord = async (user, amount, interest, interestPercentage, status, startDate, dueDate, repaymentAmount, remark) => {
    try {
        const newLoan = await Loan_1.default.create({
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
    }
    catch (err) {
        throw err;
    }
};
exports.createLoanRecord = createLoanRecord;
const getUserLoanRecord = async (user) => {
    try {
        const allLoans = await Loan_1.default.find({ user: user._id });
        return allLoans;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserLoanRecord = getUserLoanRecord;
const getUserSettledLoan = async (user) => {
    try {
        const allLoans = await Loan_1.default.find({ user: user._id, isSettled: true });
        return allLoans;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserSettledLoan = getUserSettledLoan;
const getUserUnsettledLoan = async (user) => {
    try {
        const allLoans = await Loan_1.default.findOne({
            user: user._id,
            isSettled: false,
        });
        return allLoans;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserUnsettledLoan = getUserUnsettledLoan;
