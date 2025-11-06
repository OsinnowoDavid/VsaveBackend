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

    // Normalize start date and validate
    const start =
        startDate instanceof Date ? new Date(startDate) : new Date(startDate);
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
            throw new Error(
                "frequency must be 'DAILY', 'WEEKLY', or 'MONTHLY'.",
            );
    }

    return end;
}

export function calculateMaturityAmount(
    frequency: string,
    duration: number,
    amount: number,
    startDate?: Date,
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
    return amount * totalPeriods;
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

export const generateSavingsRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }

    return `Savings_${code}`;
};