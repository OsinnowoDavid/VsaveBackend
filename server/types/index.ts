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
}

export interface IVerificationToken extends Document {
  user: object;
  email: string;
  token: string;
  expiresAt: Date;
}

export interface ISuperAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture?: string;
}
