import UserReferral from "../model/User_referral"; 

export const createUserReferral = async (user:string, referredUser:string) =>{
    try{
        const newRecord = await UserReferral.create({
            user,
            referredUser,
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