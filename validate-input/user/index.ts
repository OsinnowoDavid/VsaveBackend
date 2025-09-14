import { NextFunction, Request, Response } from "express";

import registrationValidation from "registration" ;


export const validateUserRegitrationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) =>{
    const { error, isValid } =  registrationValidation(req.body)
     // check validation
  if (!isValid) {
    return res.status(400).json(error);
  } else {
    next();
  }
}

