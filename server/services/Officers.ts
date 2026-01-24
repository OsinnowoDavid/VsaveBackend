import Officers from "../model/Officers" ;


export const createOfficer = async (firstName:string,lastName:string,email:string,phoneNumber:string,area:string,referralCode:string,level:string,profilePicture?:string) =>{
    try{
        const newOfficer = await Officers.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            referralCode,
            level,
            area,
            profilePicture
        })
        return newOfficer ;
    }catch(err:any){
        throw err
    }
}

export const getOfficerById = async (id:string,addPassword?:boolean) =>{
    try{
        if(addPassword){
             const foundOfficer = await Officers.findById(id)
             return foundOfficer
        }
        const foundOfficer = await Officers.findById(id,{password:0}) ;
        return foundOfficer
    }catch(err:any){
        throw err
    }
}

export const getOfficerByEmail = async (email:string,addPassword?:boolean) =>{
    try{
        if(addPassword){
             const foundOfficer = await Officers.findOne({email})
             return foundOfficer
        }
        const foundOfficer = await Officers.findOne({ email }).select('-password');
        return foundOfficer 
    }catch(err:any){
        throw err 
    }
}

export const verifyToken = async (user:string, token:number) =>{
    try{
        const foundAdmin = await Officers.findById(user) ;
        let result = false ;
        if(foundAdmin.VerificationToken ===token){
            result = true 
            return result
        }
        return result
    }catch(err:any){
        throw err
    }
}

export const createPassword = async (user:string, password: string) =>{
    try{
         const foundAdmin = await Officers.findByIdAndUpdate(user,{password},{new:true}) ; 
         return foundAdmin
        
    }catch(err:any){
        throw err
    }
} 

