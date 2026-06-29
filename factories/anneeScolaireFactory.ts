import { AnneeScolaireDO } from "@/types/anneescolaire/AnneeScolaireDO";
import { ToAnneeScolaireDO } from "@/types/anneescolaire/AnneeScolaireDO";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { checkConnection } from "@/lib/LSVRdbConnect";

const ErrorOrigin = "anneeScolaireFactory - ";

export async function getAnneeScolaireById(anneeScolaireId : string) : Promise<AnneeScolaireDO|null> {
    const functionName = "getAnneeScolaireById - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const eleve = await client.sgs_annee_scolaire.findUnique({
            where : {
                id : anneeScolaireId
            }
        });
        if (!eleve) return null;
        return ToAnneeScolaireDO(eleve);
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getAnneeScolaireFromDate(theDate : Date) : Promise<AnneeScolaireDO|null> {
    const functionName = "getAnneeScolaireFromDate - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const anneescolaires = await client.sgs_annee_scolaire.findMany({
            where : {
                AND : [
                    {start_date : {lte : theDate}},
                    {end_date : {gte : theDate}},
                ]
            }
        });
        if (anneescolaires.length === 0) return null;
        if (anneescolaires.length > 1) throw new Error(ErrorOrigin + functionName + "Plus d'une année scolaire. Contactez votre administrateur");
        return ToAnneeScolaireDO(anneescolaires[0]);
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}