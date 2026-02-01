import UserReferral from "../model/Referral_record"; 
import User from "../model/User" ; 
import Officer from "../model/Officers";
import {generateReferralRefrenceCode} from "../config/tools" ;
import { IUser } from "../../types";

export const createUserReferral = async (user:string, referredUser:string, referralCode:string) =>{
    try{
        const newRecord = await UserReferral.create({
            user,
            referredUser,
            referralCode,
            bonusAmount:500,
            status: "pending",
            referredUserTask:{
                fundVSaveWallet:false,
                createSavingsPlan:false,
                complete5SuccessfulSavingsCircle:false,
            }
        }) 
        return newRecord 
    }catch(err:any){
        throw err 
    }
}

export const getUserReferralByStatus = async (user:string, status:string) =>{
    try{
        const foundRecord = await UserReferral.find({user,status}) ; 
        return foundRecord
    }catch(err:any){
        throw err 
    }
}

export const editUserReferralRecord = async (referredUser:string, referredUserTask:any, status:"pending" | "completed" | "rejected") =>{
    try{
        const foundRecord = await UserReferral.findOne({
            referredUser
        }) 
        foundRecord.status = status ;
        foundRecord.referredUserTask = referredUserTask ;
        if(status === "completed"){
            foundRecord.depositedToAvaliableBalnace = true ;
            foundRecord.depositedToAvaliableBalnaceDate = new Date()
        } 
        await foundRecord.save() ; 
        return foundRecord 
    }catch(err:any){
        throw err
    }
}
export const getAllUserReferralRecord = async (user:string) =>{
    try{
        const foundRecord = await UserReferral.find({ user}) ;
        return foundRecord
    }catch(err:any){
        throw err
    }
}
export const getUserReferralByReferredUser = async (referredUser: string) =>{
    try{
        const foundRecord = await UserReferral.findOne({
            referredUser
        }) 
        return foundRecord
    }catch(err:any){
        throw err
    }
}
export const createReferralCodeForUser = async (user:string) =>{
    try{
     const foundUserRecord = await User.findById(user) ;
        let referralCode = '' 
        let existingRecord= null ;
        do {
                    referralCode = generateReferralRefrenceCode("USER") ;
                    existingRecord = await User.findOne({referralCode})
                } while (existingRecord) 
        foundUserRecord.referralCode = referralCode 
        await foundUserRecord.save()      
        return foundUserRecord
    }catch(err:any){
        throw err
    }
}
export const createReferralCodeForOfficer = async (user:string) =>{
    try{
     const foundUserRecord = await User.findById(user) ;
        let referralCode = '' 
        let existingRecord= null ;
        do {
                    referralCode = generateReferralRefrenceCode("AGENT") ;
                    existingRecord = await User.findOne({referralCode})
                } while (existingRecord) 
        foundUserRecord.referralCode = referralCode 
        await foundUserRecord.save()      
        return foundUserRecord
    }catch(err:any){
        throw err
    }
}
export const assignReferral = async (user:string,referralCode:string) =>{
    try{
           const foundUser = await User.findOne({referralCode}) ;
            if(!foundUser){
                return  {err:true,message:"account created but, no user found with this referral code"}
            }
            let newRecord = await createUserReferral(foundUser._id.toString(), user,referralCode) ;
            foundUser.pendingBalance += 500 ;
            await foundUser.save() ;
            return "Successful"
    }catch(err:any){
        throw err
    }
}

export const getSingleReferralRecord = async (id:string) =>{
    try{
        const foundRecord = await UserReferral.findById(id) ;
        return foundRecord
    }catch(err:any){
        throw err
    }
}

export const getUserTypeWithReferralCode = async (referralCode:string) =>{
    try{
         let firstLetter: string = referralCode.charAt(0);  
         if(firstLetter === "U"){
            return "User"
         } 
         if(firstLetter === "A"){
            return "Officer"
         } ;
         return ""
    }catch(err:any){
        throw err
    }
}