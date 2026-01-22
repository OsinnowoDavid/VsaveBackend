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
    getRegionById,
    getSubRegionById,
    createAdminPassword,
    getAdminByEmail,
    getAllAdmin,
    getAdminByRole,
    getAllTransaction,
    updateAdminRecord,
    UpdateAdminPassword,
    getAdminById,
    deleteAdmin,
    createSubRegion,
    assignSubRegionAdmin,
    assignSubRegionAdminToSubRegion
} from "../services/Admin";
import { signUserToken } from "../config/JWT";
import {getAllLoanRecord,getLoanRecordByStatus,approveOrRejectLoan} from "../services/Loan" ;
import Admin from "../model/Regionaladmin";
import { getAllUser } from "../services/User";
import { IAdmin } from "../../types";
import SGMail from "@sendgrid/mail";
import { getAllSavingsCircle, getAllUserSavingsRecord, getSavingsDetails } from "../services/Savings";
SGMail.setApiKey(process.env.SENDGRID_API_KEY);
const getAdminRegionsOrsubregions = async (admin:string) =>{
    try{
        const foundAdmin = await Admin.findById(admin) as IAdmin ; 
        let result = {
            regionNames: [],
            subRegionNames:[]
        } as any
        if(foundAdmin.region){
            for(const region of foundAdmin.region){
                let foundRegion = await getRegionById(region) ;
                result.regionNames.push(foundRegion.regionName)
            }
        } 

         if(foundAdmin.subRegion){
            for(const subRegion of foundAdmin.subRegion){
                let foundSubRegion = await getSubRegionById(subRegion) ;
                result.subRegionNames.push(foundSubRegion.subRegionName)
            }
        }
        return result 
    }catch(err:any){
        throw err
    }
}
export const registerAdminController = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, role , profilePicture} = req.body;
        // check if admin account already exist 
        const foundAdmin = await getAdminByEmail(email) ;
        if(foundAdmin){
            return res.json({
                status:"Failed",
                message:"account already exist as an admin."
            })
        }
        const newAdmin = await CreateAdmin(
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            profilePicture
        );
        if (!newAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        } 
        const tokenNumber = Math.floor(100000 + Math.random() * 900000); 
        newAdmin.verificationCode = tokenNumber ;
        await newAdmin.save() ;
        // Send email
        const msg = {
            to: newAdmin.email,
            from: `David <davidosinnowo1@gmail.com>`,
            subject: "Welcome to VSAVE Admin Panel🎉",
            html: `Dear ${newAdmin.firstName},
                    Welcome aboard! We’re thrilled to have you as part of the GVC admin team. 
                    As a ${newAdmin.role}, you’ll play a crucial role in managing and overseeing your designated area.
                    your token to create a login password : ${tokenNumber}
                    your profile details 
                    FullNAme: ${newAdmin.firstName} ${newAdmin.lastName} 
                    email: ${newAdmin.email},
                    phoneNumber: ${newAdmin.phoneNumber} 
                    role: ${newAdmin.role}
    
          — The VSave Team.`,
        };
        const sentMail = await SGMail.send(msg);
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
export const createAdminPasswordController = async (req: Request, res: Response) => {
    try{
        const{code,email,password} = req.body ;
        const foundAdmin = await getAdminByEmail(email) ;
         let hashPassword = await argon.hash(password);
        if(!foundAdmin){
            return res.json({
                status:"Failed",
                message:"no admin found with this email"
            })
        }
        // first verify code 
        if(foundAdmin.verificationCode !== Number(code)){
            return res.json({
                status:"Failed",
                message:"Incorrect verification token"
            })
        } 
        let createPassword = await createAdminPassword(foundAdmin._id.toString(),hashPassword) 
        return res.json({
                status:"Success",
                message:"Password created",
                data: createPassword
            })
    }catch(err:any){
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
} 
export const updateAdminPasswordController = async (
    req: Request,
    res: Response,
) => {
    try{
        const user = req.user as IAdmin ;
        const {oldPassword , newPassword} = req.body ; 
        const foundAdmin = await getAdminById(user._id.toString(),true) ;
        let verifyPassword = await argon.verify(foundAdmin.password, oldPassword); 
        if(!verifyPassword){
             return res.json({
                status: "Failed",
                message: "incorrect old passsword",
            });
        } 
        let hashPassword = await argon.hash(newPassword); 
       const newRecord = await UpdateAdminPassword(foundAdmin._id.toString(),hashPassword) 
       return res.json({
        status:"Success",
        message:"password updated successfuly",
        data:newRecord
       })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}
export const resendVerificationCodeController = async (
    req: Request,
    res: Response,
) => {
    try{
        const {email} = req.params ;
        const foundAdmin = await getAdminByEmail(email) ;
        if(!foundAdmin){
            return res.json({
                status:"Failed",
                message:"no admin found with this email"
            })
        }
         const tokenNumber = Math.floor(100000 + Math.random() * 900000); 
        foundAdmin.verificationCode = tokenNumber ;
        await foundAdmin.save() ;
         // Send email
        const msg = {
            to: foundAdmin.email,
            from: `David <danyboy99official@gmail.com>`,
            subject: "Welcome to VSAVE Admin Panel🎉",
            html: `Dear ${foundAdmin.firstName}, 
                    use the last token sent
                    your token to create a login password : ${tokenNumber}
                    your profile details 
                    FullNAme: ${foundAdmin.firstName} ${foundAdmin.lastName} 
                    email: ${foundAdmin.email},
                    phoneNumber: ${foundAdmin.phoneNumber} 
                    role: ${foundAdmin.role}
    
          — The VSave Team.`,
        };
        const sentMail = await SGMail.send(msg);
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}
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
export const deleteAminController = async (
    req: Request,
    res: Response,
) => {
    try{
        const {id} = req.params ;
        const deletedRecord = await deleteAdmin(id) ;
        return res.json({
            status:"Success",
            message:"Account deleted Successfuly",
            data: deletedRecord
        })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}
export const updateAdminRecordController =  async (
    req: Request,
    res: Response,
) => {
    try{
        const {firstName,lastName,email,phoneNumber} = req.body ;
        const user = req.user as IAdmin ;
        const updatedRecord = await updateAdminRecord(user._id.toString(),firstName,lastName,email,phoneNumber) ;
        return res.json({
            status:"Success",
            message:"account updated Successfuly",
            data:updatedRecord
        })
    }catch(err:any){
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}



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
        const { regionName, shortCode,location } = req.body;
        const newRegion = await createNewRegion(regionName, shortCode, location);
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
export const createSubRegionController = async (req: Request, res: Response) =>{
    try{
        const {subRegionName,shortCode,location,region} = req.body ;
        const newSubRegion = await createSubRegion(subRegionName,shortCode,location,region) ;
        return res.json({
            status:"Success",
            message:"sub region created successfuly",
            data: newSubRegion
        })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}
export const assignSubRegionAdminToSubRegionController = async (req: Request, res: Response) =>{
    try{
        const {admin,areas} = req.body ;
        const foundAdmin = await getAdminById(admin) as IAdmin
        const assignAdmin = await assignSubRegionAdmin(foundAdmin._id.toString(),areas) ;
        const assignAdminToSubRegion = await assignSubRegionAdminToSubRegion(foundAdmin,areas) ;
        return res.json({
            status:"Success",
            message:"admin assign successfuly",
            data: assignAdmin
        })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}
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
// get all users 
export const getAllUserController = async (
    req: Request,
    res: Response,
) => {
    try{
        const allUsers = await getAllUser() 
        return res.json({
            status:"Success",
            message:"found Users",
            data:allUsers,
            numberOfUsers:allUsers.length
        })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
// get all admin
export const getAllAdminController = async (
    req: Request,
    res: Response,
) => {
    try{
        const allAdmin = await getAllAdmin() ;
         return res.json({
            status:"Success",
            message:"found Admins",
            data:allAdmin,
            numberOfAdmin:allAdmin.length
        })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
// get admin by role
export const getAllAdminByRoleController = async (
    req: Request,
    res: Response,
) => {
    try{
        const {role} = req.params
        const allAdmin = await getAdminByRole(role);
         return res.json({
            status:"Success",
            message:"found Admins",
            data:allAdmin,
            numberOfAdmin:allAdmin.length
        })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
export const getAdminDashboardDetails = async (
    req: Request,
    res: Response,
) => {
    try{
        const alltransaction = await getAllTransaction() ;
        let result = {
            totalWalletFund:0,
            totalWithdrawal:0,
            totalAirtimeAndData:0
        } 
        for(const transaction of alltransaction){
            if(transaction.type === "deposit"){
                result.totalWalletFund += transaction.amount
            }
            if(transaction.type === "withdrawal"){
                result.totalWithdrawal += transaction.amount 
            }
            if(transaction.type === "airtime"){
                result.totalAirtimeAndData += transaction.amount 
            }
            if(transaction.type === "data"){
                result.totalAirtimeAndData += transaction.amount 
            }
        } 
        
        return res.json({
            status:"Success",
            message:"details calculated successfuly",
            data: result
        })
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
export const getSavingsDetailsController = async ( req: Request,res: Response,) =>{
    try{
        const savingsDetails = await getSavingsDetails() ;
        return res.json({
            status:"Success",
            message:"savings details calculated",
            data : savingsDetails
        })
    }catch(err:any){
       return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
export const getUserSavingsDetailsController = async ( req: Request,res: Response,) =>{
    try{
        const foundRecord = await  getAllUserSavingsRecord() ;
        return res.json({
            status:"Success",
            message:"found Record",
            data: foundRecord 
        })
    }catch(err:any){
        return res.json({
            status: "Failed",
            message: err.message,
        }); 
    }
}
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
export const getAllAdminSavingsController = async (
    req: Request,
    res: Response,
) => {
    try{
        const foundRecord = await getAllSavingsCircle() ;
        return res.json({
            status:"Success",
            message:"found record",
            data:foundRecord
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

