import { NextFunction, Request, Response } from "express";

import validateRegistrationInput from "./registration";
import validateLoginInput from "./login";
import validateKYC1input from "./userKYC1";

export const validateUserRegitrationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, isNotValid } = validateRegistrationInput(req.body);
  // check validation
  if (isNotValid) {
    return res.status(400).json({
      status: "failed",
      isNotValid,
      error,
    });
  } else {
    next();
  }
};

export const validateUserLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, isNotValid } = validateLoginInput(req.body);
  // check validation
  if (isNotValid) {
    return res.status(400).json(error);
  } else {
    next();
  }
};

export const validateUserKYC1Input = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, isNotValid } = validateKYC1input(req.body);
  // check validation
  if (isNotValid) {
    return res.status(400).json(error);
  } else {
    next();
  }
};
