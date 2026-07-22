import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";

const ErrorOrigin = "toolsFactory - ";




export function SearchAll(key:string)  {
    const functionName = "searchAll - ";
    try {
        
    }
    catch(error:any) {
        throw new Error(error.message)
    }
    
}