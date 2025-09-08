import express from "express";
import { registerUser, loginUser, userProfile } from "../controller/User";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", userProfile);

export default router;
