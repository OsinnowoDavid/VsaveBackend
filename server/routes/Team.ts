import express from "express"; 
import { createPasswordController } from "../controller/Area";
const router = express.Router();

router.post("/create-password", createPasswordController)





export default router 