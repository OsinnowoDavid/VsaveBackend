import { ObjectId, Document } from "mongoose";

export interface IUser extends Document {
  id: ObjectId;
  fullname: string;
  email: string;
  phone_no: string;
  password: string;
  profile_pic: string;
  vsave_point: number;
  KYC: object;
  available_balance: number;
  pending_balance: number;
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
