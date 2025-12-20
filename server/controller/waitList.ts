import { Request, Response } from "express";
import { createWaitList, getAllWaitList,getWaitListByemail } from "../services/waitList";

export const createWaitListController = async (req:Request,res:Response) =>{
    try{
        const {fullName,email,phoneNumber,interest} = req.body ;
        // check if email already exist
        const foundUser = await getWaitListByemail(email) ;
        if(foundUser){
            return res.json({
                status:"Failed",
                message:"user already found with this email"
            })
        }
        const newList = await createWaitList(fullName,email,phoneNumber,interest) ;
        return res.status(200).json({
            response_code: 200,
            message: "wait list created",
            data: newList
        }); 
    }catch(err:any){
         return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
} 

export const getAllWaitListController = async (req:Request,res:Response) =>{
    try{
        const foundRecord = await getAllWaitList();
        return res.status(200).json({
            response_code: 200,
            message: "wait list found",
            data: foundRecord
        }); 
    }catch(err:any){
         return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
}
export const getWaitListByEmailController = async (req:Request,res:Response) =>{
    try{
        const {email} = req.params
        const foundRecord = await getWaitListByemail(email);
        return res.status(200).json({
            response_code: 200,
            message: "wait list found",
            data: foundRecord
        }); 
    }catch(err:any){
         return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
}
