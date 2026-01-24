import { Request, Response } from "express";
import argon from "argon2";
import { getAllMyTeam } from "../services/Admin"; 
import { createOfficer, getOfficerByEmail,getOfficerById, verifyToken, createPassword } from "../services/Officers";
import {generateReferralRefrenceCode} from "../config/tools"
import SGMail from "@sendgrid/mail";
export const createOfficerController = async (req: Request, res: Response) =>{
    try{
        const{ firstName,
            lastName,
            email,
            phoneNumber,
            team,
            profilePicture} = req.body ;
            const referralCode = generateReferralRefrenceCode("AGENT") ; 
            const newOfficer = await createOfficer(firstName,lastName,email,phoneNumber,team,referralCode,"1",profilePicture); 
             const tokenNumber = Math.floor(100000 + Math.random() * 900000); 
                    newOfficer.VerificationToken = tokenNumber ;
                    await newOfficer.save() ;
                    // Send email
                    const msg = {
                        to: newOfficer.email,
                        from: `David <davidosinnowo1@gmail.com>`,
                        subject: "Welcome to VSAVE Admin Panel🎉",
                        html: `Dear ${newOfficer.firstName},
                                Welcome aboard! We’re thrilled to have you as part of the GVC marketing team. 
                                you’ll play a crucial role in Onboarding User in your designated area.
                                your token to create a login password : ${tokenNumber}
                                your profile details 
                                FullNAme: ${newOfficer.firstName} ${newOfficer.lastName} 
                                email: ${newOfficer.email},
                                phoneNumber: ${newOfficer.phoneNumber} 
                
                      — The VSave Team.`,
                    };
                    const sentMail = await SGMail.send(msg);
            return res.json({
                status:"Success",
                message:"new Account created Successfuly",
                data: newOfficer
            })
    }catch(err:any){
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}

export const createPasswordController = async (req: Request, res: Response) =>{
    try{
        const {email,token,password} = req.body ;
        const foundOfficer = await getOfficerByEmail(email) ;
        const verification = await verifyToken(foundOfficer._id.toString(),token) ;
        if(verification){
            const createdPassword = await createPassword(foundOfficer._id.toString(),password) 
            return res.json({
                 status:"Success",
                message:"Password created Successfuly",
                data: createdPassword
            })
        }
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}