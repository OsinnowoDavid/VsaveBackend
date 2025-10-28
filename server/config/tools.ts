export function calculateSavingsTotalAmount(
    startDate: Date,
    endDate: Date,
    amountPerInterval: number,
    frequency: string,
): { totalIntervals: number; totalAmount: number } {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        throw new Error("Invalid start or end date");
    }

    let totalIntervals = 0;

    switch (frequency) {
        case "daily":
            totalIntervals =
                Math.ceil(
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
                ) + 1;
            break;

        case "weekly":
            totalIntervals =
                Math.ceil(
                    (end.getTime() - start.getTime()) /
                        (1000 * 60 * 60 * 24 * 7),
                ) + 1;
            break;

        case "monthly":
            totalIntervals =
                (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth()) +
                1;
            break;
    }

    const totalAmount = totalIntervals * amountPerInterval;
    return { totalIntervals, totalAmount };
}
