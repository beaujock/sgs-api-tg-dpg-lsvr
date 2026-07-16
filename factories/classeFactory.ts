import { AnneeScolaireDO } from "@/types/anneescolaire/AnneeScolaireDO";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { ClasseDO, ToClasseDO } from "@/types/classe/ClasseDO";

const ErrorOrigin = "classeFactory - ";

export async function getClasseById(classeId : string) : Promise<ClasseDO|null> {
    const functionName = "getClasseById - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const classe = await client.sgs_classe.findUnique({
            where : {
                id : classeId
            }
        });
        if (!classe) return null;
        return ToClasseDO(classe)
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}