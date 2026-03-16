import { Request, Response } from "express";
import { deleteMarkedNotification, deleteNotification, getRecipientNotofication, getSingleNotification } from "../services/Notification";
import { IUser } from "../../types";
export const getUserNotificationsController = async (req: Request, res: Response) =>{
    try{
        const user = req.user as IUser ;
        const foundNotification = await getRecipientNotofication(user._id.toString()) ; 
        for(const record of foundNotification){
            if(record.status === "sent"){
                record.status = "delivered" ;
                await record.save()
            }
        }
         return res.json({
            status: "Success",
            message: "found Notification",
            data: foundNotification
        });
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}

export const getSingleNotificationsController = async (req: Request, res: Response) =>{
    try{
        const {id} = req.params
        const foundNotification = await getSingleNotification(id) ;
        foundNotification.status = "seen" ;
        await foundNotification.save()
         return res.json({
            status: "Success",
            message: "found Notification",
            data: foundNotification
        });
    }catch(err:any){
         return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}
export const deleteNotificationController = async (req: Request, res: Response) =>{
    try{
        const {id} = req.params
         await deleteNotification(id);
        return res.json({
            status: "Success",
            message: "Notification deleted successfuly !"
        })
    }catch(err:any){
          return res.json({
            status: "Failed",
            message: err.message,
        });
    }
} 
export const deleteMarkedNotificationController = async (req: Request, res: Response) =>{
    try{
        const {ids} = req.body
         await deleteMarkedNotification(ids) 
        return res.json({
            status: "Success",
            message: "Notification deleted successfuly !"
        })
    }catch(err:any){
          return res.json({
            status: "Failed",
            message: err.message,
        });
    }
}
