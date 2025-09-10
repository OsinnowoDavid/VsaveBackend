import express from "express";
import { registerUser, loginUser, userProfile } from "../controller/User";
import { verifyUserToken } from "../config/JWT";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyUserToken, userProfile);

export default router;
