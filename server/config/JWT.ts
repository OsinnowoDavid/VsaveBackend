import jwt from "jsonwebtoken";
const jwt_secret: any = process.env.jwt_secret;
import { NextFunction, Request, Response } from "express";
import { getUserById } from "../services/User";
import { getAdminById } from "../services/Admin";
import {
    ISuperAdmin,
    IRegionalAdmin,
    ISubRegionalAdmin,
    IUser,
} from "../../types";
import {
    getRegionalAdminById,
    getSubRegionalAdminById,
} from "../services/RegionalAdmin";

export const signUserToken = (user: any) => {
    const payload = {
        user: user,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours expiry
    };
    return jwt.sign(payload, jwt_secret);
};

// Middleware to verify client JWT tokens
export const verifyUserToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Extract token from authorization header
        const { authorization = "" } = req.headers;
        if (!authorization || authorization === "") {
            return res.json({
                status: "failed!",
                msg: "No authorization token found",
            });
        }
        const decoded: any = jwt.verify(authorization, jwt_secret);

        const foundId = decoded.user._id;

        // Find client by decoded user ID

        const currentClient = await getUserById(foundId);

        if (!currentClient) {
            return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }

        // Attach user to request object
        req.user = currentClient;
        return next();
    } catch (err: any) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};

export const verifySuperAdminToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Extract token from authorization header
        const { authorization = "" } = req.headers;
        if (!authorization || authorization === "") {
            return res.json({
                status: "failed!",
                msg: "No authorization token found",
            });
        }
        const decoded: any = jwt.verify(authorization, jwt_secret);
        const foundId = decoded.user._id;
        // find superadmin by decoded user id
        const currentAdmin = await getAdminById(foundId);
        if (!currentAdmin && currentAdmin.role !== "SUPER ADMIN") {
            return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }
        // Attach user to request object
        req.user = currentAdmin;
        return next();
    } catch (err: any) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
const regionalAdminPass = (admin: any) =>{
try{
    let result = false
    if(admin.role === "SUPER ADMIN"){
        result = true
    } 
    if(admin.role === "REGIONAL ADMIN"){
        result = true
    } 
    return result
}catch(err:any){
    throw err
}
}

export const verifyRegionalAdminToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Extract token from authorization header
        const { authorization = "" } = req.headers;
        if (!authorization || authorization === "") {
            return res.json({
                status: "failed!",
                msg: "No authorization token found",
            });
        }
        const decoded: any = jwt.verify(authorization, jwt_secret);
        const foundId = decoded.user._id;
        const foundAdmin = await getAdminById(
            foundId,
        )
       
        if(!foundAdmin || !regionalAdminPass(foundAdmin)){
               return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }
        // Attach user to request object
        req.user = foundAdmin 
        return next();
    } catch (err: any) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};

export const verifySubRegionalAdminToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Extract token from authorization header
        const { authorization = "" } = req.headers;
        if (!authorization || authorization === "") {
            return res.json({
                status: "failed!",
                msg: "No authorization token found",
            });
        }
        const decoded: any = jwt.verify(authorization, jwt_secret);
        const foundId = decoded.user._id;
        const foundAdmin = await getAdminById(
            foundId,
        )
        if (!foundAdmin) {
            return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }
        // Attach user to request object
        req.user =
            foundAdmin 
        return next();
    } catch (err: any) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
