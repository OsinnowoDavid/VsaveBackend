import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/mongodB";
import userRouter from "./routes/User";
import adminRouter from "./routes/Admin";
import regionalAdminRouter from "./routes/RegionalAdmin";
import savingsRouter from "./routes/Savings";
import webhookRouter from "./routes/Webhook";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
// const allowedOrigin =[]
app.use(
    cors({
        // origin:allowedOrigin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        // allowedHeaders: ["Content-Type","Authorization"]
    }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to Vsave Backend");
});
//user route config
app.use("/user", userRouter);

// superAdmin routes config
app.use("/admin", adminRouter);

// regionaladmin routes config
app.use("/regionaladmin", regionalAdminRouter);

app.use("/savings", savingsRouter);

app.use("/webhook", webhookRouter);

app.listen(port, () => {
    console.log(`serve is running on ${port}}`);
});
