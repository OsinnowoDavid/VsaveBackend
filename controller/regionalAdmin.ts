import { Request, Response } from "express";
import argon from "argon2";
import { signUserToken } from "../config/JWT";
import {
  createRegionalAdmin,
  getRegionalAdminByEmail,
  getRegionalAdminById,
} from "../services/RegionalAdmin";

export const registerRegionalAdmin = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phoneNumber, password, region } = req.body;
    const hashPassword = await argon.hash(password);
    const newRegionalAdmin = await createRegionalAdmin(
      fullName,
      email,
      phoneNumber,
      hashPassword,
      region
    );
    if (!newRegionalAdmin) {
      return res.json({
        status: "Failed",
        message: "something went wrong, try again later",
      });
    }
    return res.json({
      status: "success",
      message: "Regional admin created successfully",
      data: newRegionalAdmin,
    });
  } catch (err: any) {
    return res.json({
      status: "Failed",
      message: err.message,
    });
  }
};

export const LoginRegionalAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const foundAdmin = await getRegionalAdminByEmail(email);
    if (!foundAdmin) {
      return res.json({
        status: "Failed",
        message: "User Not Found",
      });
    }
    let verifyPassword = await argon.verify(foundAdmin.password, password);
    if (!verifyPassword) {
      return res.json({
        status: "Failed",
        message: "incorrect Passsword",
      });
    }
    // Return success with JWT token
    return res.json({
      Status: "success",
      message: "login successfuly",
      token: signUserToken(foundAdmin),
    });
  } catch (err: any) {
    return res.json({
      status: "Failed",
      message: err.message,
    });
  }
};

export const regionalAdminProfile = async (req: Request, res: Response) => {
  try {
    let user = req.user;
    if (!user) {
      return res.json({
        Status: "Failed",
        message: "user not found",
      });
    }
    return res.json({
      Status: "success",
      message: "welcome back",
      data: user,
    });
  } catch (err: any) {
    return res.json({
      status: "Failed",
      message: err.message,
    });
  }
};
