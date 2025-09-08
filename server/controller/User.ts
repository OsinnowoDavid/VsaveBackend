import { Request, Response } from "express";
import argon from "argon2";
import { createNewUser, getUserByEmail, getUserById } from "../services/User";
import { signUserToken } from "../config/JWT";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, middlename, email, phone_no, password } =
      req.body;
    let hashPassword = await argon.hash(password);
    const newUser = await createNewUser(
      firstname,
      lastname,
      email,
      phone_no,
      hashPassword,
      middlename
    );
    if (!newUser) {
      return res.json({
        status: "Failed",
        message: "something went wrong, User not created , try again later",
      });
    }
    return res.json({
      status: "Success",
      message: "User created successfuly",
      data: newUser,
    });
  } catch (err: any) {
    res.json({
      Status: "Failed",
      message: err.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.json({
        status: "Failed",
        message: "User not found",
      });
    }
    const verifyPassword = await argon.verify(user.password, password);
    if (!verifyPassword) {
      return res.json({
        status: "Failed",
        message: "incorrect password ",
      });
    }
    // Return success with JWT token
    return res.json({
      status: "success",
      message: "login successfuly",
      token: signUserToken(user),
    });
  } catch (err: any) {
    res.json({
      Status: "Failed",
      message: err.message,
    });
  }
};

export const userProfile = async (req: Request, res: Response) => {
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
    res.json({
      Status: "Failed",
      message: err.message,
    });
  }
};
