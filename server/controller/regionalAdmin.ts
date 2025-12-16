import { Request, Response } from "express";
import argon from "argon2";
import { signUserToken } from "../config/JWT";
import {
    getRegionalAdminByEmail,
    getRegionalAdminById,
    createSubRegion,
    createSubRegionalAdmin,
    getSubRegionById,
    getSubRegionByName,
    assignSubRegionAdmin,
    getAllSubRegion,
    assignSubRegionToRegion,
} from "../services/RegionalAdmin"; 
import {} from "../services/Admin"

export const LoginRegionalAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const foundAdmin = await getRegionalAdminByEmail(email);
        if (!foundAdmin) {
            return res.json({
                status: "Failed",
                message: "User Not Found",
            });
        }
        let verifyPassword = await argon.verify(foundAdmin.password, password);
        if (!verifyPassword) {
            return res.json({
                status: "Failed",
                message: "incorrect Passsword",
            });
        }
        // Return success with JWT token
        return res.json({
            Status: "success",
            message: "login successfuly",
            token: signUserToken(foundAdmin),
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const regionalAdminProfile = async (req: Request, res: Response) => {
    try {
        let user = req.user;
        if (!user) {
            return res.json({
                Status: "Failed",
                message: "user not found",
            });
        }
        return res.json({
            Status: "success",
            message: "welcome back",
            data: user,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const createSubRegionController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { subRegionName, shortCode, region } = req.body;
        const newSubRegion = await createSubRegion(
            subRegionName,
            shortCode,
            region.toString(),
        );
        if (!newSubRegion) {
            return res.json({
                status: "Failed",
                message: "something went wrong try agian later",
            });
        }
        await assignSubRegionToRegion(region.toString(), newSubRegion);
        return res.json({
            status: "Success",
            message: "SubRegion created successfuly",
            data: newSubRegion,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const createSubRegionalAdmincontroller = async (
    req: Request,
    res: Response,
) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, subRegion } =
            req.body;
        let hashPassword = await argon.hash(password);
        const newSubRegionalAdmin = await createSubRegionalAdmin(
            firstName,
            lastName,
            email,
            hashPassword,
            phoneNumber,
            subRegion,
        );
        if (!newSubRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong try agian later",
            });
        }
        await assignSubRegionAdmin(newSubRegionalAdmin, subRegion.toString());
        return res.json({
            status: "Success",
            message: "SubRegion created successfuly",
            data: newSubRegionalAdmin,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getAllSubRegionController = async (
    req: Request,
    res: Response,
) => {
    try {
        const allSubRegion = await getAllSubRegion();
        if (!allSubRegion) {
            return res.json({
                status: "Failed",
                message: "No SubRegion Found",
            });
        }
        return res.json({
            status: "Success",
            message: "Found SubRegion",
            data: allSubRegion,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getSubRegionByIdController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { id } = req.params;
        const foundSubRegion = await getSubRegionById(id);
        if (!foundSubRegion) {
            return res.json({
                status: "Failed",
                message: "something went wrong try agian later",
            });
        }
        return res.json({
            status: "Success",
            message: "SubRegion created successfuly",
            data: foundSubRegion,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
