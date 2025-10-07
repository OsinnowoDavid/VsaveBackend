import { NextFunction, Request, Response } from "express";

import validateRegistrationInput from "./registration";

export const validateAdminRegistrationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, isNotValid } = validateRegistrationInput(req.body);
  // check validation
  if (isNotValid) {
    return res.status(400).json({
      status: "failed",
      message: "inValid Input",
      error,
    });
  } else {
    next();
  }
};
