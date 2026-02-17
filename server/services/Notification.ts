import Notification from "../model/Notification" ;


export const createNotification = async (from:string, title:string, message:string, recipientType:string, recipientId:string , status:string, senderId?: string) =>{
    try{
        const newNotification = await Notification.create({
            from,
            title,
            message,
            recipientType,
            recipientId,
            status,
            senderId
        }) ;
        return newNotification
    }catch(err:any){
        throw err 
    }
} 

export const getAllNotification = async () =>{
    try{
        const foundNotification = await Notification.find() ; 
        return foundNotification
    }catch(err:any){
        throw err 
    }
}

export const getRecipientNotofication = async (recipient:string) =>{
    try{
        const foundNotification = await Notification.find({recipientId:recipient}) ;
        return foundNotification
    }catch(err:any){
        throw err 
    }
}

export const getSingleNotification = async (id:string) =>{
    try{
        const foundNotification = await Notification.findById(id) ;
        return foundNotification
    }catch(err:any){
        throw err
    }
}

export const changeNotificationStatus = async (id:string, status:"sent"|"delivered"|"seen") =>{
    try{
        const foundRecord = await Notification.findByIdAndUpdate(id,{status}) ;
        return foundRecord
    }catch(err:any){
        throw err 
    }
}