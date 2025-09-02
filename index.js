import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import connectDB from "./config/mongodB.js"

import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
const port = process.env.PORT 
const app = express()
app.use(express.json())
// const allowedOrigin =[]
app.use(cors({
    // origin:allowedOrigin, 
    credentials:true,    
    methods: ["GET","POST","PUT","DELETE"],
        // allowedHeaders: ["Content-Type","Authorization"]
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
connectDB()


app.get("/", (req, res) => {
    res.send("Welcome to Home Backend")
})


app.listen(port, () =>{
    console.log("Server is running ")
})