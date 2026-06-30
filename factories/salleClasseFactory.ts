import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { SalleClasseDO, ToSalleClasseDO } from "@/types/salleclasse/SalleClasseDO";

const ErrorOrigin = "salleClasseFactory - ";

export async function getSalleClasseById(salleClasseId : string) : Promise<SalleClasseDO|null> {
    const functionName = "getSalleClasseById - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const salleclasse = await client.sgs_salle_classe.findUnique({
            where : {
                id : salleClasseId
            }
        });
        if (!salleclasse) return null;
        return ToSalleClasseDO(salleclasse);
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}