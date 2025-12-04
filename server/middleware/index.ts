import {
    startPauseSavings,
    endExpiredSavings,
    deductSavingsFromUser,
    savingsDisbursement,
    fixedSavingsDisbursement,
} from "./SavingsJobs";
import { loanDeductionJob } from "./LoanDeductionJob";

export const firstMinsOfTheDayJob = async () => {
    try {
        console.log("firstMinsOfTheDayJob has started");
        // first start all pending job that is suppose to start
        await startPauseSavings();
        // end savings that is suppose to end
        await endExpiredSavings();
        // savings deduction job
        await deductSavingsFromUser();
        // savings disbursement
        await savingsDisbursement();
        console.log("firstMinsOfTheDayJob has ended");
        return "Done";
    } catch (err: any) {
        return err;
    }
};

export const hourlyScheduleJob = async () => {
    try {
        console.log("secondScheduleJob has started");
        //fixed savings disbursement job
        await fixedSavingsDisbursement();
        //loan deduction job
        await loanDeductionJob();
        console.log("secondScheduleJob has ended");
        return "Done";
    } catch (err: any) {
        return err;
    }
};
