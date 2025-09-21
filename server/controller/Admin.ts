import { Request, Response } from "express";
import argon from "argon2";
import { CreateSuperAdmin, getAllSuperAdminByEmail } from "../services/Admin";
import { signUserToken } from "../config/JWT";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;
    let hashPassword = await argon.hash(password);
    const newAdmin = await CreateSuperAdmin(
      fullName,
      email,
      phoneNumber,
      hashPassword
    );
    if (!newAdmin) {
      return res.json({
        status: "Failed",
        message: "something went wrong, try again later",
      });
    }
    return res.json({
      status: "Failed",
      message: "Regional admin created successfully",
      data: newAdmin,
    });
  } catch (err: any) {
    return res.json({
      status: "Failed",
      message: err.message,
    });
  }
};

export const LoginSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const foundAdmin = await getAllSuperAdminByEmail(email);
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

export const superAdminProfile = async (req: Request, res: Response) => {
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
