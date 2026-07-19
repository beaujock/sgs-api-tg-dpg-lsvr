import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { EpreuveDO, ToEpreuveDO } from "@/types/epreuve/EpreuveDO";

const ErrorOrigin = "evaluationFactory - ";

export async function getEpreuveById(epreuveID:string) : Promise<EpreuveDO|null> {
    const functionName = "getEpreuveById - ";
        try {
            const connection:LSVRdbConnection = await checkConnection();
            if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
            const client:PrismaClient = connection.client;
            const epreuve = await client.sgs_epreuve.findUnique({
                where : {
                    id : epreuveID
                }
            });
            if (!epreuve) return null;
            return ToEpreuveDO(epreuve);
        }
        catch(error:any){
            throw new Error(ErrorOrigin + functionName + error.message);
        }
}