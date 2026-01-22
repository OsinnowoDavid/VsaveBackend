import Admin from "../model/Admin";
import RegionalAdmin from "../model/Regionaladmin";
import Region from "../model/Region";
import SubRegion from "../model/SubRegion";
import { IAdmin, ISuperAdmin } from "../../types";
import AdminConfig from "../model/Admin_config"; 
import Transaction from "../model/Transaction";
export const CreateAdmin = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    role: string,
    profilePicture?: string,
) => {
    try {
        
        const newSuperAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            profilePicture,
        });
        return newSuperAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getAdminById = async (id: string, withpassword?:boolean) => {
    try {
        if(withpassword){
             const foundAdmin = await Admin.findById(id);
            return foundAdmin;
        }
        const foundAdmin = await Admin.findById(id, { password: 0 });
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};
export const getAdminByEmail = async (email: string) => {
    try {
        const foundAdmin = await Admin.findOne({ email});
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};
export const getAllAdmin = async ()=>{
    try{
        const allAdmin = await Admin.find() ;
        return allAdmin
    }catch(err:any){
        throw err
    }
}
export const getAdminByRole = async (role:string)=>{
    try{
        const admins = await Admin.find({role:role.toUpperCase()}) 
        return admins
    }catch(err:any){
        throw err
    }
}
export const getAllSuperAdminByEmail = async (email: string) => {
    try {
        const foundAdmin = await Admin.findOne({ email, role: "SUPER ADMIN" });
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};
export const createAdminPassword = async (admin:string,password:string) =>{
    try{
        const foundAdmin = await Admin.findById(admin) ;
        foundAdmin.password = password ; 
        foundAdmin.isEmailVerified = true ;
        await foundAdmin.save() ;
        return foundAdmin
    }catch(err:any){
        throw err 
    }
}
export const deleteAdmin = async (id:string) =>{
    try{
        const deletedRecord = await Admin.findByIdAndDelete(id) ;
        return "Done"
    }catch(err:any){
        throw err
    }
}
export const createNewRegion = async (
    regionName: string,
    shortCode: string,
    location:string
) => {
    try {
        const newRegion = await Region.create({
            regionName,
            shortCode,
            location
        });
        return newRegion;
    } catch (err: any) {
        throw err;
    }
};

export const createRegionalAdmin = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    region: [string],
    profilePicture?: string,
) => {
    try {
        const newRegionalAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            region,
            role: "REGIONAL ADMIN",
            profilePicture,
        });
        return newRegionalAdmin;
    } catch (err: any) {
        throw err;
    }
};
export const assignRegionalAdmin = async (
    admin: any,
    region: [string],
) => {
    try {
       for(const id of region){
         const foundRegion = await Region.findById(id);
        if (!foundRegion) {
            throw "region not found !";
        }
        foundRegion.admin.push(admin._id);
          await foundRegion.save();
       }
      
        return 'Done'
    } catch (err: any) {
        throw err;
    }
};
export const updateAdminRecord = async (id:string,firstName:string, lastName:string,email:string,phoneNumber:string ) =>{
    try{
        const foundAdmin = await Admin.findByIdAndUpdate(id,{firstName,lastName, email,phoneNumber}) ;
        return foundAdmin
    }catch(err:any){
        throw err 
    }
}
export const UpdateAdminPassword = async (id:string,password:string) =>{
    try{
       const foundAdmin = await Admin.findByIdAndUpdate(id,{password}) ;
       return foundAdmin
    }catch(err:any){
        throw err
    }
}
export const assignRegionalAdminToRegions = async (region:[string], regionalAdmin:string)=>{
    try{
        const foundAdmin = await Admin.findById(regionalAdmin);
        for(const id of region){
             if(foundAdmin.region.length > 10){
            throw {message:"Regional Admin already assigned to 10 region"}
        }
            foundAdmin.region.push(id) 
        }
       await foundAdmin.save() ;
       return foundAdmin
    }catch(err:any){
        throw err
    }
}
export const getAllRegionalAdmin = async () => {
    try {
        const allRegionalAdmin = await Admin.find();
        return allRegionalAdmin; 
    } catch (err: any) {
        throw err;
    }
};
export const getRegionalAdmins = async (region:string) =>{
    try{
        const foundRecord = await Admin.find({region}) ;
        return foundRecord
    }catch(err:any){
        throw err
    }
}

export const getRegionalAdminById = async (id: string) => {
    try {
        const foundAdmin = await Admin.findOne({id,role:"REGIONAL ADMIN"});
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getRegionalAdminByEmail = async (email: string) => {
    try {
        const foundAdmin = await Admin.findOne({ email });
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getAllRegion = async () => {
    try {
        const allRegion = await Region.find();
        let result: any = [];
        allRegion.forEach((region) => {
            let finalResult = {
                region: region.regionName,
                shortCode: region.shortCode,
            };
            result.push(finalResult);
        });
        return result;
    } catch (err: any) {
        throw err;
    }
};

export const getRegionByName = async (regionName: string) => {
    try {
        const foundRegion = await Region.findOne({ regionName });
        return foundRegion;
    } catch (err: any) {
        throw err;
    }
};
export const getRegionById = async (id:string) =>{
    try{
            const foundRecord = await Region.findById(id) ;
            return foundRecord
    }catch(err:any){
        throw err
    }
}
export const createSubRegion = async (areaName:string, shortCode:string, location:string,region:string) =>{
    try{
        const newSubRegion = await SubRegion.create({
            subRegionName: areaName,
            shortCode,
            location,
            region
        })
        const foundRegion = await Region.findById(region) ;
        foundRegion.areas.push(newSubRegion._id) ;
         await foundRegion.save()
        return newSubRegion
    }catch(err:any){
        throw err
    }
}
export const assignSubRegionAdmin = async (admin:string, subRegion:[string])  =>{
    try{
        const foundAdmin = await Admin.findById(admin) ;
        for(const record of subRegion){
            const foundSubRegion = await SubRegion.findById(record) ;
            if(!foundSubRegion){
                throw {Message:"no sub region found with this ID"}
            }
            foundAdmin.subRegion.push(record) ;
        } 
        await  foundAdmin.save() ;
        return foundAdmin
    }catch(err:any){
        throw err
    }
}
export const assignSubRegionAdminToSubRegion = async (admin:IAdmin, subRegion:[string]) =>{
    try{
        for(const id of subRegion){
         const foundSubRegion = await SubRegion.findById(id);
        if (!foundSubRegion) {
            throw {message:"no sub region found with this ID"};
        }
        foundSubRegion.admin.push(admin._id);
          await foundSubRegion.save();
       }
      
        return 'Done'
    }catch(err:any){
        throw err 
    }
}
export const getAllSubRegion = async () =>{
    try{
        const foundRecord = await SubRegion.find(); 
        return foundRecord
    }catch(err:any){
        throw err
    }
}
export const getAllMySubRegion = async (admin:string) =>{
    try{
        const foundAdmin = await Admin.findById(admin) ;
        let result = [] ;
       if(foundAdmin.role === "SUBREGIONAL ADMIN"){
         for(const record of foundAdmin.subRegion){
            const foundArea = await SubRegion.findById(record) ;
            result.push(foundArea) ;
        }
        return result 
       }
       if(foundAdmin.role === "REGIONAL ADMIN"){
            for(const record of foundAdmin.region){
                const foundRegion = await Region.findById(record) ;
                for(const areaRecord of foundRegion.areas){
                    const foundArea = await SubRegion.findById(areaRecord) ;
                    result.push(foundArea) ;
                }
            }
            return result 
       }
       const allArea = await SubRegion.find() ;
       return allArea
    }catch(err:any){
        throw err
    }
}
export const setAdminSavingsConfig = async (
    defaultPenaltyFee: string,
    firstTimeAdminFee: string,
    loanPenaltyFee: string,
    fixedSavingsAnualInterest: string,
    fixedSavingsPenaltyFee: string,
    terminalBonus:string
) => {
    try {
        const configSettings = await AdminConfig.getSettings();
        configSettings.defaultPenaltyFee = defaultPenaltyFee;
        configSettings.firstTimeAdminFee = firstTimeAdminFee;
        configSettings.loanPenaltyFee = loanPenaltyFee;
        configSettings.fixedSavingsAnualInterest = fixedSavingsAnualInterest;
        configSettings.fixedSavingsPenaltyFee = fixedSavingsPenaltyFee;
        configSettings.terminalBonus = terminalBonus
        await configSettings.save();
        return configSettings;
    } catch (err: any) {
        throw err;
    }
};

export const getAdminSavingsConfig = async () => {
    try {
        const configSettngs = await AdminConfig.getSettings();
        return configSettngs;
    } catch (err: any) {
        throw err;
    }
};
type INotificationTo = "User" | "Regionaladmin" | "SubRegionalAdmin" | "Agent";
export const sendNotification = async (
    to: INotificationTo,
    recipientId: string,
    title: string,
    message: string,
) => {
    try {
    } catch (err: any) {
        throw err;
    }
};
export const createSubRegionalAdmin = async (  firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    region: string,
    subRegion:string,
    profilePicture?: string) =>{
        try{
            const newSubRegionalAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            region,
            subRegion,
            role: "SUBREGIONAL ADMIN",
            profilePicture,
            }) 
            return newSubRegionalAdmin 
        }catch(err:any){
            throw err
        }
    } ;

    export const getAllSubRegionalAdmin = async (subRegion:string) =>{
        try{
            const foundRecord = await Admin.find({subRegion}) ;
            return foundRecord 
        }catch(err:any){
            throw err
        }
    } 

    export const getSubRegionaladminByEmail = async (email:string, subRegion?:string) =>{
        try{
            const foundAdmin = await Admin.findOne({
                email,
                subRegion
            })
        }catch(err:any){
            throw err
        }
    }
export const getSubRegionById = async (id:string) =>{
    try{
        const foundRecord = await SubRegion.findById(id) ;
        return foundRecord
    }catch(err:any){
        throw err
    }
}
export const getAllTransaction = async () =>{
    try{ 
        const allTransaction = await Transaction.find() 
        return allTransaction
    }catch(err:any){
        throw err
    }
}