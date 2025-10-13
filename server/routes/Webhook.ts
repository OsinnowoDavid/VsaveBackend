import express from "express";
import { squadWebhookController } from "../controller/Webhook";

const router = express.Router();

router.post("/squadco", squadWebhookController);

export default router;
