import { NextFunction, Request, Response } from "express";

import validateRegistrationInput from "./registration";
import validateLoginInput from "./login";

export const validateUserRegitrationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, isValid } = validateRegistrationInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(error);
  } else {
    next();
  }
};

export const validateUserLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, isValid } = validateLoginInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(error);
  } else {
    next();
  }
};
