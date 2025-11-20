import "express";

declare module "express-serve-static-core" {
    interface Request {
        loanElegibility?: any;
        validateTransactionPin: {
            status: boolean;
            pin: number;
        };
    }
}
