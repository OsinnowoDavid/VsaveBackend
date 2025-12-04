"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfContributionIsCompleted = exports.isPastTomorrow = exports.isPastYesterday = exports.generateLoanRefrenceCode = exports.generateSavingsRefrenceCode = exports.generateRefrenceCode = void 0;
exports.calculateEndDate = calculateEndDate;
exports.calculateMaturityAmount = calculateMaturityAmount;
exports.getDayName = getDayName;
exports.getFiveMinutesAgo = getFiveMinutesAgo;
exports.isOlderThanThreeMonths = isOlderThanThreeMonths;
exports.getStageAndMaxAmount = getStageAndMaxAmount;
exports.getUserRating = getUserRating;
exports.calculateProportionalInterest = calculateProportionalInterest;
exports.getCurrentDateWithClosestHour = getCurrentDateWithClosestHour;
function calculateEndDate(frequency, startDate, duration) {
    if (typeof duration !== "number" ||
        !Number.isFinite(duration) ||
        duration < 1) {
        throw new Error("duration must be a positive integer (>= 1).");
    }
    // ---- FORCE LOCAL TIME (Africa/Lagos) ----
    const start = startDate instanceof Date ? new Date(startDate) : new Date(startDate);
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
            throw new Error("frequency must be 'DAILY', 'WEEKLY', or 'MONTHLY'.");
    }
    // Normalize endDate to same local timezone start of day
    end.setHours(0, 0, 0, 0);
    return end;
}
function calculateMaturityAmount(frequency, duration, amount, adminFirstTimeFee) {
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
            throw new Error("Invalid frequency. Must be daily, weekly, or monthly.");
    }
    totalPeriods = Math.floor(totalPeriods); // optional rounding
    let totalDeposit = amount * totalPeriods;
    let adminFee = (amount * adminFirstTimeFee) / 100;
    let result = Number(totalDeposit) - Number(adminFee);
    return result;
}
function getDayName(dateString) {
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
function getFiveMinutesAgo() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    return fiveMinutesAgo;
}
const generateRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    let marchantId = process.env.MARCHANT_ID;
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return `${marchantId}_${code}`;
};
exports.generateRefrenceCode = generateRefrenceCode;
const generateSavingsRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return `Savings_${code}`;
};
exports.generateSavingsRefrenceCode = generateSavingsRefrenceCode;
const generateLoanRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return `Loan_${code}`;
};
exports.generateLoanRefrenceCode = generateLoanRefrenceCode;
function isOlderThanThreeMonths(createdDate) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return createdDate < threeMonthsAgo;
}
function getStageAndMaxAmount(totalSavings) {
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
        }
        else {
            break;
        }
    }
    // Handle special case for Stage 10 (requires admin approval)
    const approvalType = eligibleStage.stage === 10 ? "Admin" : "Auto";
    return {
        stage: eligibleStage.stage,
        maxLoan: eligibleStage.maxLoan,
        approvalType,
        note: eligibleStage.stage === 10
            ? "Stage 10 loans require admin approval."
            : "Eligible for auto approval.",
    };
}
function getUserRating(loans) {
    // Count how many loans have been fully paid back
    const paidLoansCount = loans.length;
    let ratingStatus;
    let interestRate;
    if (paidLoansCount >= 8) {
        ratingStatus = "excellent";
        interestRate = 0.2;
    }
    else if (paidLoansCount >= 3) {
        ratingStatus = "good";
        interestRate = 1.0;
    }
    else if (paidLoansCount >= 1) {
        ratingStatus = "beginner";
        interestRate = 1.2;
    }
    else {
        ratingStatus = "no rating";
        interestRate = 1.2;
    }
    return { ratingStatus, interestRate };
}
function calculateProportionalInterest(amount, annualRate, durationInDays) {
    const daysInYear = 365;
    const interestPercentage = (annualRate * durationInDays) / daysInYear;
    const interestAmount = (amount * interestPercentage) / 100;
    return {
        interestAmount,
        interestPercentage,
    };
}
function getCurrentDateWithClosestHour() {
    const now = new Date();
    // Normalize to local hour (Africa/Lagos) without changing the day
    const local = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, // minutes
    0, // seconds
    0);
    return local;
}
const isPastYesterday = (date) => {
    const input = new Date(date);
    input.setHours(0, 0, 0, 0); // Normalize input to local midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return input <= yesterday;
};
exports.isPastYesterday = isPastYesterday;
const isPastTomorrow = (date) => {
    const input = new Date(date);
    input.setHours(0, 0, 0, 0); // Normalize input to local midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return input <= tomorrow;
};
exports.isPastTomorrow = isPastTomorrow;
const checkIfContributionIsCompleted = (recordStatus) => {
    let isContributionComplete = true;
    for (const status of recordStatus) {
        if (status === "pending") {
            isContributionComplete = false;
        }
    }
    return isContributionComplete;
};
exports.checkIfContributionIsCompleted = checkIfContributionIsCompleted;
