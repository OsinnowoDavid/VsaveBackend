import WaitList from "../model/waitList" ;

export const createWaitList = async (fullName:string,email:string,phoneNumber:string,interest:string) =>{
    try{
        const newWaitList = await WaitList.create({
            fullName,
            email,
            phoneNumber,
            interest
        }) ;
        return newWaitList
    }catch(err:any){
        throw err
    }
}

export const getAllWaitList = async () =>{
    try{
        const allWaitList = await WaitList.find() ;
        return allWaitList
    }catch(err:any){
        throw err
    }
}