import { Types, Document } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    profilePicture: string;
    vsavePoint: number;
    subRegion: Types.ObjectId | string;
    KYC: Types.ObjectId | null;
    availableBalance: number;
    pendingBalance: number;
    isEmailVerified: boolean;
    status: string;
    address: string;
    bvn?: string;
    gender: "Male" | "Female" | string;
    dateOfBirth: Date | string;
    virtualAccountNumber: string;
}

export interface IVerificationToken extends Document {
    user?: Types.ObjectId;
    email: string;
    token: string;
    expiresAt: Date;
}

export interface ISuperAdmin extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    password: string;
    profilePicture?: string | null | undefined;
}

export interface IRegion extends Document {
    _id: Types.ObjectId;
    regionName: string;
    shortCode: string;
    admin: Types.ObjectId[];
    subRegion: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRegionalAdmin extends Document {
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

export interface ISubRegion extends Document {
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

export interface IAgent extends Document {
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

export interface IKYC extends Document {
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

export interface IKYC1 extends Document {
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

export interface ILoan extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    InitialAmount: number;
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

export interface INotification extends Document {
    _id: Types.ObjectId;
    type: string;
    message: string;
}

export interface IWebhook extends Document {
    _id: Types.ObjectId;
    user?: Types.ObjectId;
    payload: object;
    signature?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISubRegionalAdmin extends Document {
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

export interface ITransaction extends Document {
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

export interface IAdminConfig extends Document {
    _id: Types.ObjectId;
    defaultPenaltyFee?: string;
    firstTimeAdminFee?: string;
}

export interface IAgentReferral extends Document {
    _id: Types.ObjectId;
    agent: Types.ObjectId;
    referralCode: string;
    referres?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IBankCode extends Document {
    _id: Types.ObjectId;
    bankCode?: string;
    bank?: string;
}

export interface ISavingsCircle extends Document {
    _id: Types.ObjectId;
    savingsPlanId: Types.ObjectId;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    numberOfPeriod?: number;
    savingsAmount: number;
    startDate?: Date;
    endDate?: Date;
    circleIndex?: number;
    status?: "ACTIVE" | "PAUSED" | "ENDED";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISavingsGroup extends Document {
    _id: Types.ObjectId;
    savingsId: Types.ObjectId;
    savingsCircleId: Types.ObjectId;
    users: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserSavingsRecord extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    savingId: Types.ObjectId;
    savingsCircleId: Types.ObjectId;
    records?: {
        period?: string;
        periodIndex?: string;
        amount?: number;
        status?: "pending" | "paid";
    }[];
    status?: "ACTIVE" | "PAUSED" | "ENDED";
    maturityAmount?: number;
    payOut?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISavingsPlan extends Document {
    _id: Types.ObjectId;
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
