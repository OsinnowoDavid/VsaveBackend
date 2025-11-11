"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoanRefrenceCode = exports.generateSavingsRefrenceCode = exports.generateRefrenceCode = void 0;
exports.calculateEndDate = calculateEndDate;
exports.calculateMaturityAmount = calculateMaturityAmount;
exports.getDayName = getDayName;
exports.getFiveMinutesAgo = getFiveMinutesAgo;
exports.isOlderThanThreeMonths = isOlderThanThreeMonths;
exports.getStageAndMaxAmount = getStageAndMaxAmount;
exports.getUserRating = getUserRating;
function calculateEndDate(frequency, startDate, duration) {
    if (typeof duration !== "number" ||
        !Number.isFinite(duration) ||
        duration < 1) {
        throw new Error("duration must be a positive integer (>= 1).");
    }
    // Normalize start date and validate
    const start = startDate instanceof Date ? new Date(startDate) : new Date(startDate);
    if (isNaN(start.getTime())) {
        throw new Error("startDate is invalid.");
    }
    // Work on a copy so we don't mutate input
    const end = new Date(start.getTime());
    switch (frequency) {
        case "DAILY":
            // inclusive: duration=1 => same day
            end.setDate(end.getDate() + (duration - 1));
            break;
        case "WEEKLY":
            // each period = 7 days; inclusive
            end.setDate(end.getDate() + (duration * 7 - 1));
            break;
        case "MONTHLY":
            // adding months while keeping day where possible;
            // inclusive: duration=1 => same month/day
            // Use setMonth which handles month overflow (and end-of-month behavior)
            end.setMonth(end.getMonth() + (duration - 1));
            break;
        default:
            // compile-time safety but also runtime guard
            throw new Error("frequency must be 'DAILY', 'WEEKLY', or 'MONTHLY'.");
    }
    return end;
}
function calculateMaturityAmount(frequency, duration, amount, startDate) {
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
    return amount * totalPeriods;
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
