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
export const getUnreadNotification = async (recipient:string) =>{
   const foundRecord = await Notification.find({recipient,status:"delivered"}) ; 
   return foundRecord
}

export const deleteNotification = async (id:string) =>{
    try{
        const deletedRecord = await Notification.findByIdAndDelete(id) ;
        return deletedRecord
    }catch(err:any){
        throw err
    }
}

export const deleteMarkedNotification = async (ids:[string]) =>{
    try{
        for(const id of ids){
            await Notification.findByIdAndDelete(id) ;
        }
        return "Done"
    }catch(err:any){
        throw err
    }
}
export const notificationCount = async (user:string) =>{
    try{
        const foundRecord = await Notification.find({recipientId:user}) 
       let numberOfDelivered =  0 ;
        let numberOfSeen = 0 ;
        for(const record of foundRecord){
            if(record.status === "seen"){
               numberOfSeen++
            }
             if(record.status === "delivered"){
                numberOfDelivered++
            }
        }
        let totalNumber = foundRecord.length ; 
        return {totalNumber, numberOfDelivered ,numberOfSeen }
    }catch(err:any){
        throw err
    }
}
