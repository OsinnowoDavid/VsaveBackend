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
const node_cron_1 = __importDefault(require("node-cron"));
const middleware_1 = require("./middleware");
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// const allowedOrigin =[]
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
(0, mongodB_1.default)();
// schedule node-cron job to deductSavings from users account
node_cron_1.default.schedule("0 6 * * *", middleware_1.firstMinsOfTheDayJob, {
    timezone: "Africa/Lagos",
});
node_cron_1.default.schedule("0 * * * *", middleware_1.hourlyScheduleJob, {
    timezone: "Africa/Lagos",
});
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
