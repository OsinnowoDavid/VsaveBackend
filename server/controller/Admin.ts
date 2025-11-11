import { Request, Response } from "express";
import argon from "argon2";
import {
    CreateSuperAdmin,
    getAllSuperAdminByEmail,
    createRegionalAdmin,
    createNewRegion,
    getAllRegion,
    getRegionByName,
    getRegionalAdminById,
    getRegionalAdminByEmail,
    getAllRegionalAdmin,
    assignRegionalAdmin,
    setAdminSavingsConfig,
    getAdminSavingsConfig,
} from "../services/Admin";
import { signUserToken } from "../config/JWT";

export const registerAdminController = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        let hashPassword = await argon.hash(password);
        const newAdmin = await CreateSuperAdmin(
            firstName,
            lastName,
            email,
            phoneNumber,
            hashPassword,
        );
        if (!newAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        return res.json({
            Status: "success",
            message: "SuperAdmin Account created successfuly",
            data: newAdmin,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const LoginSuperAdminController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { email, password } = req.body;
        const foundAdmin = await getAllSuperAdminByEmail(email);
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

export const superAdminProfileController = async (
    req: Request,
    res: Response,
) => {
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

export const createRegionalAdminController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            region,
            profilePicture,
        } = req.body;
        let hashPassword = await argon.hash(password);
        const newRegionalAdmin = await createRegionalAdmin(
            firstName,
            lastName,
            email,
            phoneNumber,
            hashPassword,
            region.toString(),
            profilePicture,
        );
        if (!newRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        // assing regional admin to is region
        await assignRegionalAdmin(newRegionalAdmin, region);
        return res.json({
            status: "Success",
            message: "Regional admin created successfully",
            data: newRegionalAdmin,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const createNewRegionController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { regionName, shortCode } = req.body;
        const newRegion = await createNewRegion(regionName, shortCode);
        if (!newRegion) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        return res.json({
            status: "Success",
            message: "Region  created successfully",
            data: newRegion,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getAllRegionController = async (req: Request, res: Response) => {
    try {
        const allRegion = await getAllRegion();
        if (!allRegion) {
            return res.json({
                status: "Failed",
                message: "No Region Found",
            });
        }

        return res.json({
            status: "Success",
            message: "Region Found",
            data: allRegion,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getAllRegionalAdminController = async (
    req: Request,
    res: Response,
) => {
    try {
        const allRegionalAdmin = await getAllRegionalAdmin();
        if (!allRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "No Region Found",
            });
        }

        return res.json({
            status: "Success",
            message: "Region Found",
            data: allRegionalAdmin,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getRegionalAdminByEmailController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { email } = req.params;
        const foundRegionalAdmin = await getRegionalAdminByEmail(email);
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const setAdminConfigController = async (req: Request, res: Response) => {
    try {
        const {
            defaultPenaltyFee,
            firstTimeAdminFee,
            loanInterestFee,
            loanPenaltyFee,
        } = req.body;
        const config = await setAdminSavingsConfig(
            defaultPenaltyFee,
            firstTimeAdminFee,
            loanInterestFee,
            loanPenaltyFee,
        );
        if (!config) {
            return res.json({
                status: "Failed",
                message: "something went wrong",
            });
        }
        return res.json({
            status: "Success",
            message: "record updated",
            data: config,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getAdminSavingsConfigController = async (
    req: Request,
    res: Response,
) => {
    try {
        const configSettings = await getAdminSavingsConfig();
        return res.json({
            status: "Success",
            message: "config setting",
            data: configSettings,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
