import jwt from "jsonwebtoken";
const jwt_secret: any = process.env.jwt_secret;
import { NextFunction, Request, Response } from "express";
import { getUserById } from "../services/User";

export const signUserToken = (user: any) => {
  const payload = {
    user: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours expiry
  };
  return jwt.sign(payload, jwt_secret);
};

// Middleware to verify client JWT tokens
export const verifyUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from authorization header
    const { authorization = "" } = req.headers;
    const decoded: any = jwt.verify(authorization, jwt_secret);

    const foundId = decoded.user;

    // Find client by decoded user ID
    const currentClient = await getUserById(foundId);

    if (!currentClient) {
      return res.json({
        status: "failed!",
        msg: "user not authorized!!",
      });
    }

    // Attach user to request object
    req.user = currentClient;

    return next();
  } catch (err: any) {
    return res.json(err.message);
  }
};
