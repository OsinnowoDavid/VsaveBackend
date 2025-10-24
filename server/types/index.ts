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

export interface ISavings extends Document {
    _id: Types.ObjectId;
    // savings model not defined in models folder yet; placeholder for future fields
}

export interface IStaticsInfo extends Document {
    _id: Types.ObjectId;
    // statics_info model not defined; placeholder for future fields
}
