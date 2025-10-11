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
    KYC: object;
    availableBalance: number;
    pendingBalance: number;
    isEmailVerified: boolean;
    status: string;
    address: string;
    bvn: string;
    gender: string;
    dateOfBirth: Date | string;
    virtualAccountNumber: string;
}

export interface IVerificationToken extends Document {
    user: object;
    email: string;
    token: string;
    expiresAt: Date;
}

export interface ISuperAdmin extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
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
    fullName: string;
    email: string;
    phoneNumber: string;
    region: Types.ObjectId;
    password: string;
    profilePicture?: string;
    referralCode: string;
    referres: Types.ObjectId[];
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
    type: "deposit" | "withdrawal" | "transfer";
    amount: number;
    status: "pending" | "success" | "failed" | "reversed";
    reference: string;
    description?: string;
    channel: "bank" | "card" | "wallet" | "ussd" | "other";
    balanceBefore?: number;
    balanceAfter?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IWebhook extends Document {
    _id: Types.ObjectId;
    provider: "squad" | "paystack" | "flutterwave" | "other";
    eventType?: string;
    transactionReference?: string;
    virtualAccountNumber?: string;
    amount?: number;
    currency?: string;
    status: "pending" | "processed" | "failed";
    rawPayload: object;
    signature?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
