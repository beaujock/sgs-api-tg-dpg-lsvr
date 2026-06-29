import { EleveDO, ToEleveDO } from "@/types/eleve/EleveDO";
import { InscriptionDO, ToInscriptionDO } from "@/types/inscription/InscriptionDO";
import { CreateEleveDO } from "@/types/eleve/CreateEleveDO";
import { getAnneeScolaireFromDate } from "./anneeScolaireFactory";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";

const ErrorOrigin = "eleveFactory - ";

export async function createEleve(data : CreateEleveDO) : Promise<EleveDO|null> {
    const functionName = "createEleve - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const createdEleve = await client.sgs_eleve.create({
            data : {
                matricule       : data.matricule,
                last_name       : data.last_name,
                first_name      : data.first_name,
                other_names     : data.other_names,
                preferred_name  : data.preferred_name,
                date_of_birth   : data.date_of_birth,
                gender          : data.gender,
                phone_number    : data.phone_number,
                email           : data.email,
                notes           : data.notes,
                created_by      : data.created_by,
                create_date     : new Date(Date.now())
            }
        });
        if(!createdEleve) throw new Error(ErrorOrigin + functionName + "Echec creation de l'élève " + data.last_name + " " + data.first_name + " - Matricule : " + data.matricule);
        return createdEleve;
    }
    catch(error) {
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getEleveById(eleveId : string) : Promise<EleveDO|null> {
    const functionName = "getEleveById - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const eleve = await client.sgs_eleve.findUnique({
            where : {
                id : eleveId
            }
        });
        if (!eleve) return null;
        return ToEleveDO(eleve);
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getEleveByMatricule(eleveMatricule : string) : Promise<EleveDO|null> {
    const functionName = "getEleveByMatricule - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const eleve = await client.sgs_eleve.findUnique({
            where : {
                matricule : eleveMatricule
            }
        });
        if (!eleve) return null;
        return ToEleveDO(eleve);
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getEleveCurrentInscription(eleveId : string) : Promise<InscriptionDO|null> {
    const functionName = "getEleveCurrentInscription - ";
    try {
        const anneeScolaireInscriptions:InscriptionDO[] = [];
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const anneescolaire = await getAnneeScolaireFromDate(new Date(Date.now()));
        if (anneescolaire === null) return null;
        const inscriptions = await client.sgs_inscription.findMany({
            where : {
                eleve_id : eleveId,
                registration_status : 'A'
            },
            include : {
                sgs_salle_classe : true
            },
        });
        if (inscriptions.length === 0) return null;
        inscriptions.forEach(inscription =>{
            if (inscription.sgs_salle_classe.annee_scolaire_id === anneescolaire.id) anneeScolaireInscriptions.push(ToInscriptionDO(inscription));
        });
        if (anneeScolaireInscriptions.length === 0) return null;
        if (anneeScolaireInscriptions.length > 1) throw new Error(ErrorOrigin + functionName + "L'élève a plus d'une inscription actif. Contactez cotre aministrateur");
        return anneeScolaireInscriptions[0];
    }
    catch(error) {
        throw new Error(ErrorOrigin + functionName + error);
    }
}