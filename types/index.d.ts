import { Types, Document } from "mongoose";

declare interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string | null;
    profilePicture?: string | null;
    vsavePoint: number;
    subRegion?: Types.ObjectId | string | null;
    KYC?: Types.ObjectId | null;
    availableBalance: number;
    pendingBalance: number;
    isEmailVerified: boolean;
    pin?: string;
    status?: string | null;
    gender?: "Male" | "Female" | string | null | undefined;
    dateOfBirth?: Date | string | null | undefined;
    virtualAccountNumber?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
declare interface IVerificationToken extends Document {
    user?: Types.ObjectId;
    email: string;
    token: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ISuperAdmin extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    password: string;
    profilePicture?: string | null | undefined;
}

declare interface IRegion extends Document {
    _id: Types.ObjectId;
    regionName: string;
    shortCode: string;
    admin: Types.ObjectId[];
    subRegion: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IRegionalAdmin extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    profilePicture?: string;
    region: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ISubRegion extends Document {
    _id: Types.ObjectId;
    subRegionName: string;
    shortCode: string;
    region: Types.ObjectId;
    admin: Types.ObjectId[];
    agent: Types.ObjectId[];
    user: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IAgent extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    subRegion: Types.ObjectId; // ref: Region in code (field name is subRegion)
    password: string;
    profilePicture?: string;
    referralCode: string;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IKYC extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    kycStage: number;
    status: "pending" | "verified" | "rejected";
    documents: {
        kyc_stage: number;
        documents: string[];
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IKYC1 extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    profession:
        | "Lottory Agent"
        | "Student"
        | "Self Employed"
        | "Unemployed"
        | "Other";
    accountNumber: number;
    bank: string;
    accountDetails: string;
    country: string;
    state: string;
    bvn: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ILoan extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    amount: number;
    currentAmount: number;
    status: "pending" | "approved" | "rejected" | "active" | "completed";
    issueDate?: Date;
    dueDate?: Date;
    repayments: {
        amount: number;
        date: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface INotification extends Document {
    _id: Types.ObjectId;
    type: string;
    message: string;
}

declare interface IWebhook extends Document {
    _id: Types.ObjectId;
    user?: Types.ObjectId;
    payload: object;
    signature?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ISubRegionalAdmin extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    profilePicture?: string;
    subRegion: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ITransaction extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    type: "deposit" | "withdrawal" | "transfer" | "airtime" | "data";
    amount: number;
    feeCharged?: number;
    status: "pending" | "success" | "failed" | "reversed";
    transactionReference: string;
    remark?: string;
    balanceBefore?: number;
    balanceAfter?: number;
    sender?: string;
    reciever?: string;
    network?: string;
    date?: Date;
    bundle?: object;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IAdminConfig extends Document {
    _id: Types.ObjectId;
    defaultPenaltyFee?: string;
    firstTimeAdminFee?: string;
}

declare interface IAgentReferral extends Document {
    _id: Types.ObjectId;
    agent: Types.ObjectId;
    referralCode: string;
    referres?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IBankCode extends Document {
    _id: Types.ObjectId;
    bankCode?: string;
    bank?: string;
}

declare interface ISavingsCircle extends Document {
    _id: Types.ObjectId;
    savingsPlanId: Types.ObjectId;
    savingsTitle: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    subRegion: Types.ObjectId;
    duration: number;
    deductionPeriod: string;
    savingsAmount: number;
    startDate?: Date;
    endDate?: Date;
    circleIndex?: number;
    status?: "ACTIVE" | "PAUSED" | "ENDED";
    maturityAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ISavingsGroup extends Document {
    _id: Types.ObjectId;
    savingsId: Types.ObjectId;
    savingsCircleId: Types.ObjectId;
    users: Types.ObjectId[];
    subRegion: Types.ObjectId;
    status: string;
    periods: number;
    duration: number;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IUserSavingsRecord extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    savingsCircleId: Types.ObjectId;
    period?: number; // default 1 in schema
    duration?: number;
    startDate?: Date;
    endDate?: Date;
    contributionId?: Types.ObjectId | null;
    payOutDate?: Date;
    status?: "ACTIVE" | "PAUSED" | "ENDED" | "PENDING";
    maturityAmount?: number;
    payOutStatus?: boolean;
    autoRestartEnabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ISavingsPlan extends Document {
    _id: Types.ObjectId;
    savingsTitle: string;
    subRegion: Types.ObjectId;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    savingsAmount: number;
    noOfcircleIndex?: number;
    firstTimeAdminFee?: string;
    autoRestartEnabled?: boolean;
    status?: "ACTIVE" | "PAUSED" | "ENDED";
    adminId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ILoanElegibility extends Document {
    _id: Types.ObjectId;
    user?: Types.ObjectId;
    stage?: number;
    payedLastLoan?: string;
    elegibility?: boolean;
    lastLoanId?: Types.ObjectId | null;
    elegibilityAmount?: number;
    interestRate?: string;
    status?: "no rating" | "beginner" | "good" | "excellent";
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface ISavingsContribution extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    savingsRecordId: Types.ObjectId;
    record?: {
        period?: string;
        periodIndex?: string;
        amount?: number;
        status?: "pending" | "paid";
    }[];
    currentAmountSaved?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IUserSavingsCircle extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    savingsTitle?: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    duration: number;
    deductionPeriod?: string;
    firstTimeAdminFee?: string;
    savingsAmount: number;
    circleId?: string;
    status?: "ACTIVE" | "PAUSED" | "ENDED";
    maturityAmount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

declare interface IFixedSavings extends Document {
    _id: Types.ObjectId;
    user?: Types.ObjectId;
    title: string;
    amount: number;
    currency?: string;
    interestRate?: string;
    paymentAmount?: number;
    duration?: string;
    durationIndex?: number;
    startDate?: Date;
    endDate?: Date;
    status?: "pending" | "rejected" | "active" | "completed";
    createdAt?: Date;
    updatedAt?: Date;
}
