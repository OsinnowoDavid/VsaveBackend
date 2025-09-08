import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/mongodB";
import userRouter from "./routes/User";

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
  })
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

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
