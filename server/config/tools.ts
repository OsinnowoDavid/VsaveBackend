import { LargeNumberLike } from "node:crypto";

export function calculateEndDate(
    frequency: string,
    startDate: Date | string,
    duration: number,
): Date {
    if (
        typeof duration !== "number" ||
        !Number.isFinite(duration) ||
        duration < 1
    ) {
        throw new Error("duration must be a positive integer (>= 1).");
    }

    // ---- FORCE LOCAL TIME (Africa/Lagos) ----
    const start =
        startDate instanceof Date ? new Date(startDate) : new Date(startDate);

    if (isNaN(start.getTime())) {
        throw new Error("startDate is invalid.");
    }

    // Normalize to **local** midnight (prevents timezone shifts)
    start.setHours(0, 0, 0, 0);

    // Copy for calculation
    const end = new Date(start.getTime());

    switch (frequency) {
        case "DAILY":
            end.setDate(end.getDate() + (duration - 1));
            break;

        case "WEEKLY":
            end.setDate(end.getDate() + duration * 7 - 1);
            break;

        case "MONTHLY":
            end.setMonth(end.getMonth() + (duration - 1));
            break;

        default:
            throw new Error(
                "frequency must be 'DAILY', 'WEEKLY', or 'MONTHLY'.",
            );
    }

    // Normalize endDate to same local timezone start of day
    end.setHours(0, 0, 0, 0);

    return end;
}

export function calculateMaturityAmount(
    frequency: string,
    duration: number,
    amount: number,
    adminFirstTimeFee: number,
) {
    let totalPeriods;

    switch (frequency) {
        case "DAILY":
            totalPeriods = duration; // duration in days
            break;
        case "WEEKLY":
            totalPeriods = duration; // duration in days, divide by 7
            break;
        case "MONTHLY":
            totalPeriods = duration; // duration in days, divide by 30
            break;
        default:
            throw new Error(
                "Invalid frequency. Must be daily, weekly, or monthly.",
            );
    }

    totalPeriods = Math.floor(totalPeriods); // optional rounding
    let totalDeposit = amount * totalPeriods;
    let adminFee = (amount * adminFirstTimeFee) / 100;
    let result = Number(totalDeposit) - Number(adminFee);
    return result;
}

export function getDayName(dateString: Date | string) {
    // Convert the string to a Date object
    const date = new Date(dateString);

    // List of days
    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];

    // Get the day name
    return days[date.getDay()];
}

export function getFiveMinutesAgo(): Date {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    return fiveMinutesAgo;
}

export const generateRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    let marchantId = process.env.MARCHANT_ID;
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }

    return `${marchantId}_${code}`;
};
export const generateLottoryRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    let marchantId = process.env.MARCHANT_ID;
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }

    return `Lotto_${code}`;
};
export const generateSavingsRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }

    return `Savings_${code}`;
};
export const generateLoanRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }

    return `Loan_${code}`;
};

export function isOlderThanThreeMonths(createdDate: Date): boolean {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return createdDate < threeMonthsAgo;
}

export function getStageAndMaxAmount(totalSavings: number) {
    const STAGES = [
        { stage: 1, minSavings: 5000, maxLoan: 10000 },
        { stage: 2, minSavings: 7500, maxLoan: 15000 },
        { stage: 3, minSavings: 10000, maxLoan: 20000 },
        { stage: 4, minSavings: 12500, maxLoan: 25000 },
        { stage: 5, minSavings: 15000, maxLoan: 30000 },
        { stage: 6, minSavings: 17500, maxLoan: 35000 },
        { stage: 7, minSavings: 20000, maxLoan: 40000 },
        { stage: 8, minSavings: 22500, maxLoan: 45000 },
        { stage: 9, minSavings: 25000, maxLoan: 50000 },
        { stage: 10, minSavings: 30000, maxLoan: "50000+" }, // Requires admin approval
    ];

    // If savings are below ₦5,000, user is not yet eligible for any stage
    if (totalSavings < 5000) {
        return {
            stage: 0,
            maxLoan: 0,
            approvalType: "Not Eligible",
            note: "Minimum ₦5,000 savings required to access Stage 1 loan.",
        };
    }

    // Find the highest stage the user qualifies for based on their savings
    let eligibleStage = STAGES[0];
    for (const s of STAGES) {
        if (totalSavings >= s.minSavings) {
            eligibleStage = s;
        } else {
            break;
        }
    }

    // Handle special case for Stage 10 (requires admin approval)
    const approvalType = eligibleStage.stage === 10 ? "Admin" : "Auto";

    return {
        stage: eligibleStage.stage,
        maxLoan: eligibleStage.maxLoan,
        approvalType,
        note:
            eligibleStage.stage === 10
                ? "Stage 10 loans require admin approval."
                : "Eligible for auto approval.",
    };
}

export function getUserRating(loans: any) {
    // Count how many loans have been fully paid back
    const paidLoansCount = loans.length;
    let ratingStatus;
    let interestRate;

    if (paidLoansCount >= 8) {
        ratingStatus = "excellent";
        interestRate = 0.2;
    } else if (paidLoansCount >= 3) {
        ratingStatus = "good";
        interestRate = 1.0;
    } else if (paidLoansCount >= 1) {
        ratingStatus = "beginner";
        interestRate = 1.2;
    } else {
        ratingStatus = "no rating";
        interestRate = 1.2;
    }

    return { ratingStatus, interestRate };
}
interface interestResult {
    interestAmount: number;
    interestPercentage: number;
}
export function calculateProportionalInterest(
    amount: number,
    annualRate: number,
    durationInDays: number,
): interestResult {
    const daysInYear = 365;
    const interestPercentage = (annualRate * durationInDays) / daysInYear;
    const interestAmount = (amount * interestPercentage) / 100;
    return {
        interestAmount,
        interestPercentage,
    };
}

export function getCurrentDateWithClosestHour(): Date {
    const now = new Date();

    // Normalize to local hour (Africa/Lagos) without changing the day
    const local = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        0, // minutes
        0, // seconds
        0, // milliseconds
    );

    return local;
}

export const isPastYesterday = (date: Date) => {
    const input = new Date(date);
    input.setHours(0, 0, 0, 0); // Normalize input to local midnight

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return input <= yesterday;
};

export const isPastTomorrow = (date: Date) => {
    const input = new Date(date);
    input.setHours(0, 0, 0, 0); // Normalize input to local midnight

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return input <= tomorrow;
};

export const checkIfContributionIsCompleted = (recordStatus: [any]) => {
    let isContributionComplete = true;
    for (const status of recordStatus) {
        if (status === "pending") {
            isContributionComplete = false;
        }
    }
    return isContributionComplete;
};

export function getEndTimeFromSeconds(seconds:number) {
  const now = new Date(); // current time
  const endTime = new Date(now.getTime() + seconds * 1000);
  return endTime;
}

export function getEndTimeFromSecondsLive(seconds: number): Date {
  const now = new Date();
  // Deduct 20 minutes (1200 seconds)
  const adjustedSeconds = seconds - 1200;
  const endTime = new Date(now.getTime() + adjustedSeconds * 1000);
  return endTime;
}

export const generateReferralRefrenceCode = (type:"AGENT"|"USER") => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    if(type === "AGENT"){
     return `A_${code}`;
    }
    if(type === "USER"){
         return `U_${code}`;
    }
};