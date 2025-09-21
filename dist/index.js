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
const RegionalAdmin_1 = __importDefault(require("./routes/RegionalAdmin"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
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
app.get("/", (req, res) => {
    res.send("Welcome to Vsave Backend");
});
//user route config
app.use("/user", User_1.default);
// superAdmin routes config
app.use("/admin", Admin_1.default);
// regionaladmin routes config
app.use("/regionaladmin", RegionalAdmin_1.default);
console.log("got here");
app.listen(port, () => {
    console.log(`serve is running on ${port}}`);
});
