import Officers from "../model/Officers" ;


export const createOfficer = async () =>{
    try{
        const newOfficer = await Officers.create({
            
        })
    }catch(err:any){
        throw err
    }
}