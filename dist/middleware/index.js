"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionPinMiddleware = exports.hourlyScheduleJob = exports.firstMinsOfTheDayJob = void 0;
const SavingsJobs_1 = require("./SavingsJobs");
const LoanDeductionJob_1 = require("./LoanDeductionJob");
const firstMinsOfTheDayJob = async () => {
    try {
        console.log("firstMinsOfTheDayJob has started");
        // first start all pending job that is suppose to start
        await (0, SavingsJobs_1.startPauseSavings)();
        // end savings that is suppose to end
        await (0, SavingsJobs_1.endExpiredSavings)();
        // savings deduction job
        await (0, SavingsJobs_1.deductSavingsFromUser)();
        // savings disbursement
        await (0, SavingsJobs_1.savingsDisbursement)();
        console.log("firstMinsOfTheDayJob has ended");
        return "Done";
    }
    catch (err) {
        return err;
    }
};
exports.firstMinsOfTheDayJob = firstMinsOfTheDayJob;
const hourlyScheduleJob = async () => {
    try {
        console.log("secondScheduleJob has started");
        //fixed savings disbursement job
        await (0, SavingsJobs_1.fixedSavingsDisbursement)();
        //loan deduction job
        await (0, LoanDeductionJob_1.loanDeductionJob)();
        console.log("secondScheduleJob has ended");
        return "Done";
    }
    catch (err) {
        return err;
    }
};
exports.hourlyScheduleJob = hourlyScheduleJob;
const transactionPinMiddleware = (req, res, next) => {
    if (!req.validateTransactionPin) {
        req.validateTransactionPin = {
            pin: 0,
            status: false,
        };
    }
    next();
};
exports.transactionPinMiddleware = transactionPinMiddleware;
