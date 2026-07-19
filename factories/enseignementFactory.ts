import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { MatiereDO, ToMatiereDO } from "@/types/matiere/MatiereDO";


const ErrorOrigin = "enseignementFactory - ";

export async function getMatiereById(matiereId:string) : Promise<MatiereDO|null> {
    const functionName = "getMatiereById - ";
            try {
                const connection:LSVRdbConnection = await checkConnection();
                if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
                const client:PrismaClient = connection.client;
                const matiere = await client.sgs_matiere.findUnique({
                    where : {
                        id : matiereId
                    }
                });
                if (!matiere) return null;
                return ToMatiereDO(matiere);
            }
            catch(error:any){
                throw new Error(ErrorOrigin + functionName + error.message);
            }
}