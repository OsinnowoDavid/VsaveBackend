import jwt from "jsonwebtoken";
const jwt_secret: any = process.env.jwt_secret;
import { NextFunction, Request, Response } from "express";
import { getUserById } from "../services/User";
import { getSuperAdminById } from "../services/Admin";
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
        const currentAdmin = await getSuperAdminById(foundId);
        if (!currentAdmin) {
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
        const foundSuperAdmin = (await getSuperAdminById(
            foundId,
        )) as ISuperAdmin;
        const foundRegionalAdmin = (await getRegionalAdminById(
            foundId,
        )) as IRegionalAdmin;
        if (!(foundSuperAdmin || foundRegionalAdmin)) {
            return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }
        // Attach user to request object
        req.user = foundSuperAdmin || foundRegionalAdmin;
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
        const foundSuperAdmin = (await getSuperAdminById(
            foundId,
        )) as ISuperAdmin;
        const foundRegionalAdmin = (await getRegionalAdminById(
            foundId,
        )) as IRegionalAdmin;
        const foundSubRegionalAdmin = (await getSubRegionalAdminById(
            foundId,
        )) as ISubRegionalAdmin;
        console.log("user", {
            superAdmin: foundSuperAdmin,
            regionalAdmin: foundRegionalAdmin,
            subRegionalAdmin: foundSubRegionalAdmin,
        });
        if (!(foundSuperAdmin || foundRegionalAdmin || foundSubRegionalAdmin)) {
            console.log("got to superadmin");
            return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }
        // Attach user to request object
        req.user =
            foundSuperAdmin || foundRegionalAdmin || foundSubRegionalAdmin;
        return next();
    } catch (err: any) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
