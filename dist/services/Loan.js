"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLoanRecordBalance = exports.approveOrRejectLoan = exports.editLoanRecord = exports.getLoanRecordByStatus = exports.getAllLoanRecord = exports.getUserLoanByStatus = exports.allUnsettledRecord = exports.payUnsettledLoan = exports.getUserUnsettledLoan = exports.getUserSettledLoan = exports.getUserLoanRecord = exports.createLoanRecord = void 0;
const Loan_1 = __importDefault(require("../model/Loan"));
const createLoanRecord = async (user, loanTitle, amount, interest, interestPercentage, status, startDate, dueDate, repaymentAmount, remark) => {
    try {
        const newLoan = await Loan_1.default.create({
            user,
            loanTitle,
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
        const loan = await Loan_1.default.findOne({
            user: user._id,
            isSettled: false,
        });
        return loan;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserUnsettledLoan = getUserUnsettledLoan;
const payUnsettledLoan = async (user, amount) => {
    try {
        const foundLoanRecord = await (0, exports.getUserUnsettledLoan)(user);
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
        let newRepaymentAmount = Number(foundLoanRecord.repaymentAmount) - amount;
        foundLoanRecord.repaymentAmount = Number(newRepaymentAmount);
        foundLoanRecord.repayments.push({
            amount,
            date: new Date(),
        });
        await foundLoanRecord.save();
        return foundLoanRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.payUnsettledLoan = payUnsettledLoan;
const allUnsettledRecord = async () => {
    try {
        const allUnsettledLoan = await Loan_1.default.find({
            isSettled: false,
        });
        return allUnsettledLoan;
    }
    catch (err) {
        throw err;
    }
};
exports.allUnsettledRecord = allUnsettledRecord;
const getUserLoanByStatus = async (user, status) => {
    try {
        const foundRecord = await Loan_1.default.find({ user, status }).populate({ path: 'user', select: '-password' });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserLoanByStatus = getUserLoanByStatus;
const getAllLoanRecord = async () => {
    try {
        const foundRecord = await Loan_1.default.find().populate({ path: 'user', select: '-password' });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllLoanRecord = getAllLoanRecord;
const getLoanRecordByStatus = async (status) => {
    try {
        const foundRecord = await Loan_1.default.find({ status }).populate({ path: 'user', select: '-password' });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getLoanRecordByStatus = getLoanRecordByStatus;
const editLoanRecord = async (id, amount, interest, interestPercentage, repaymentAmount, startDate, duration, endDate, remark) => {
    try {
        const foundLoanRecord = await Loan_1.default.findById(id);
        foundLoanRecord.amount = amount;
        foundLoanRecord.interest = interest;
        foundLoanRecord.interestPercentage = interestPercentage;
        foundLoanRecord.repaymentAmount = repaymentAmount;
        foundLoanRecord.startDate = startDate;
        foundLoanRecord.duration = duration;
        foundLoanRecord.dueDate = endDate;
        if (remark) {
            foundLoanRecord.remark = remark;
        }
        await foundLoanRecord.save();
        return foundLoanRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.editLoanRecord = editLoanRecord;
const approveOrRejectLoan = async (id, status, duration, dueDate) => {
    try {
        const foundRecord = await Loan_1.default.findById(id);
        if (status === "approved") {
            foundRecord.status = "approved";
            foundRecord.startDate = new Date();
            foundRecord.duration = duration;
            foundRecord.dueDate = dueDate;
            await foundRecord.save();
            return foundRecord;
        }
        foundRecord.status = "rejected";
        await foundRecord.save();
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.approveOrRejectLoan = approveOrRejectLoan;
const getAllLoanRecordBalance = async (user) => {
    try {
        const foundRecords = await Loan_1.default.find({ user });
        let result = {
            completedLoanTotal: 0,
            pendingLoanTotal: 0
        };
        for (const record of foundRecords) {
            if (record.status === "completed") {
                let balance = 0;
                for (const repaymentRecord of record.repayments) {
                    balance += repaymentRecord.amount;
                }
                result.completedLoanTotal += balance;
            }
            if (record.status === "pending") {
                let balance = 0;
                for (const repaymentRecord of record.repayments) {
                    balance += repaymentRecord.amount;
                }
                result.pendingLoanTotal += balance;
            }
        }
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllLoanRecordBalance = getAllLoanRecordBalance;
