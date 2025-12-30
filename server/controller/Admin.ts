import { Request, Response } from "express";
import argon from "argon2";
import {
    CreateAdmin,
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
    getRegionalAdmins,
    assignRegionalAdminToRegions,
} from "../services/Admin";
import { signUserToken } from "../config/JWT";
import {getAllLoanRecord,getLoanRecordByStatus,approveOrRejectLoan} from "../services/Loan" ;
import Admin from "../model/Regionaladmin";
import { IAdmin } from "../../types";

export const registerAdminController = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, role , profilePicture} = req.body;
        let hashPassword = await argon.hash(password);
        const newAdmin = await CreateAdmin(
            firstName,
            lastName,
            email,
            phoneNumber,
            hashPassword,
            role,
            profilePicture
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
            region,
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

export const assignRegionalAdminToRegionController = async  (
    req: Request,
    res: Response,
) => {
    try{
        const {regionalAdmin,region} = req.body ; 

    const foundAdmin = await Admin.findById(regionalAdmin) as IAdmin
    
    const assignRegion = await assignRegionalAdmin(regionalAdmin, region); 
     const assignRegionalAdminToRegion = await assignRegionalAdminToRegions(region,regionalAdmin) ;

     return res.json({
        status: "Success",
        message: "admin assigned to region"
     })

    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}

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

export const getRegionalAdminsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {region} = req.body
        const allRegionalAdmin = await getRegionalAdmins(region);
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
          return res.json({
            status: "Success",
            message: "Regional admin Found",
            data: foundRegionalAdmin,
        });
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
            loanPenaltyFee,
            fixedSavingsAnualInterest,
            fixedSavingsPenaltyFee,
            terminalBonus
        } = req.body;
        const config = await setAdminSavingsConfig(
            defaultPenaltyFee,
            firstTimeAdminFee,
            loanPenaltyFee,
            fixedSavingsAnualInterest,
            fixedSavingsPenaltyFee,
            terminalBonus
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

export const getAdminConfigController = async (
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

// get all loan record
export const getAllLoanRecordController = async (
    req: Request,
    res: Response,
) => {
    try {
         const foundRecord = await getAllLoanRecord() ;
         return res.json({
            status:"Success",
            message: "found Record",
            data: foundRecord
         })
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
// get  loan record by status
export const getLoanRecordByStatusController = async (
    req: Request,
    res: Response,
) => {
    try{
        const {status} = req.body ;
        const foundRecords = await getLoanRecordByStatus(status);
        return res.json({
            status:"Success",
            message: "found record",
            data: foundRecords
        })
    }catch(err:any){
        return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
// aprovve pending loan
export const approveOrRejectLoanController =  async (
    req: Request,
    res: Response,
) => {
    try{
        const {id, status, duration} = req.body ;
        const dueDate = new Date() ;
         dueDate.setDate(dueDate.getDate() + duration);
        const record = await approveOrRejectLoan(id,status,duration,dueDate) ;
        return res.json({
            status: "Success",
            message: "record updated",
            data: record 
        })
    }catch(err:any){
        return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
// edit pending loan for approval
// send general notification
// send personal notification
// suspend admin account
