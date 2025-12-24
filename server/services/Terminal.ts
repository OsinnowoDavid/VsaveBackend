import User from "../model/User" 
import {generateLottoryRefrenceCode} from "../config/tools"
import TerminalTransaction from "../model/TerminalTransaction"; 
import TerminalDetails from "../model/TerminalDetails";
export const generateAndAsignLottoryId = async (user:string) =>{
    try{
        let lottoryId = "" ;
        let existingRecord = {}
        do {
            lottoryId = generateLottoryRefrenceCode() ;
            existingRecord = await User.findOne({lottoryId})
        } while (existingRecord)
        
            const foundRecord = await User.findById(user) ;
            foundRecord.lottoryId = lottoryId ;
            await foundRecord.save()
            //create terminal details record 
            await TerminalDetails.create({
                userId:user,
                lottoryId,
            })
            return lottoryId
    }catch(err){
        throw err
    }
}

export const createTerminalRecord = async (user:string, amount:number, transactionReference:string, remark?:string) =>{
try{
    const foundUser = await User.findById(user) ;
    const newTerminalRecord = await TerminalTransaction.create({
        userId:foundUser._id ,
        type:"deposit",
        amount,
        status:"success",
        transactionReference,
        from: `${foundUser.firstName} ${foundUser.lastName}`,
        date:new Date(),
        lottoryId: foundUser.lottoryId,

    })
    return newTerminalRecord
}catch(err:any){
    throw err
}
}

export const depositToTerminalAccount = async (user:string, amount:number) =>{
    try{
        const foundRecord = await TerminalDetails.findOne({userId:user}) ;
         foundRecord.terminalBalance += amount ;
          await foundRecord.save() ;
          return foundRecord
    }catch(err:any){
        throw err
    }
}

export const getTerminalDetails = async (user:string) =>{
    try{
        const foundRecord = await TerminalDetails.findOne({userId:user}) ;
        return foundRecord
    }catch(err:any){
        throw err
    }
}

export const getTerminalTransaction = async (user:string) =>{
    try{
        const foundRecords = await TerminalTransaction.find({userId:user})
        return foundRecords
    }catch(err:any){
        throw err
    }
}
export const getSingleTerminalTransaction = async (id:string) =>{
    try{
        const foundRecord = await TerminalTransaction.findById(id) ;
        return foundRecord
    }catch(err:any){
        throw err
    }
}