import { ObjectId, Document } from "mongoose";

export interface IUser extends Document {
  id: ObjectId;
  fullName: string;
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
}

export interface IVerificationToken extends Document {
  user: object;
  email: string;
  token: string;
  expiresAt: Date;
}
