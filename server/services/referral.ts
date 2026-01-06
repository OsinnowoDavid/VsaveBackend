import UserReferral from "../model/User_referral"; 
import User from "../model/User" ;
import {generateReferralRefrenceCode} from "../config/tools" ;

export const createUserReferral = async (user:string, referredUser:string) =>{
    try{
        const foundUserRecord = await User.findById(user) ;
        const newRecord = await UserReferral.create({
            user,
            referredUser,
            referralCode: foundUserRecord.referralCode,
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
export const assignReferral = async (user:string,referralCode:string) =>{
    try{
        let foundUser = null ;
        let firstLetter: string = referralCode.charAt(0);
        // check if its a User referral code 
        if(firstLetter === "U"){
            foundUser = await User.findOne({referralCode}) ;
            if(!foundUser){
                throw {message:"account created but, no user found with this referral code"}
            }
            let newRecord = await createUserReferral(foundUser._id.toString(), user) ;
            foundUser.pendingBalance += 500 ;
            await foundUser.save() ;
            return newRecord
        } ;
        throw {message: "account created but, invalid referral code"}
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
export const assignReferralCodeToExistingUser = async () =>{
    try{
        const allUser = await User.find() ;
        for(const user of allUser){
            user.referralCode = generateReferralRefrenceCode("USER") ;
            await user.save()
        } 
        return "done"
    }catch(err:any){
        throw err 
    }
}