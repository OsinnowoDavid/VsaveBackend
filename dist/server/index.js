"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongodB_1 = __importDefault(require("./config/mongodB"));
const User_1 = __importDefault(require("./routes/User"));
const Admin_1 = __importDefault(require("./routes/Admin"));
const Loan_1 = __importDefault(require("./routes/Loan"));
const RegionalAdmin_1 = __importDefault(require("./routes/RegionalAdmin"));
const Savings_1 = __importDefault(require("./routes/Savings"));
const Webhook_1 = __importDefault(require("./routes/Webhook"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//import { deductSavingsFromUser, textNodeCron } from "./middleware/SavingsJobs";
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// const allowedOrigin =[]
app.use((0, cors_1.default)({
    // origin:allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
(0, mongodB_1.default)();
// schedule node-cron job to deductSavings from users account
// nodeCron.schedule("0 0 * * *", deductSavingsFromUser, {
//     timezone: "Africa/Lagos",
// });
// nodeCron.schedule("15 19 * * *", textNodeCron, {
//     timezone: "Africa/Lagos",
// });
app.get("/", (req, res) => {
    res.send("Welcome to Vsave Backend");
});
//app.post("/deducte-savings", deductSavingsFromUser);
//user route config
app.use("/user", User_1.default);
// superAdmin routes config
app.use("/admin", Admin_1.default);
// regionaladmin routes config
app.use("/regionaladmin", RegionalAdmin_1.default);
app.use("/savings", Savings_1.default);
app.use("/webhook", Webhook_1.default);
app.use("/loan", Loan_1.default);
app.listen(port, () => {
    console.log(`serve is running on ${port}`);
});
