import { EleveDO, ToEleveDO } from "@/types/eleve/EleveDO";
import { InscriptionDO, ToInscriptionDO } from "@/types/inscription/InscriptionDO";
import { CreateEleveDO } from "@/types/eleve/CreateEleveDO";
import { getAnneeScolaireFromDate } from "./anneeScolaireFactory";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { EvaluationDO, ToEvaluationDO } from "@/types/evaluation/EvaluationDO";
import { PresenceDO, ToPresenceDO } from "@/types/presence/PresenceDO";
import { DisplayPresenceDO, ToDisplayPresenceDO } from "@/types/presence/DisplayPresenceDO";
import { OverviewEleveDO, ToOverviewEleveDO } from "@/types/eleve/OverviewEleveDO";

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
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const anneescolaire = await getAnneeScolaireFromDate(new Date(Date.now()));
        if (anneescolaire === null) return null;
        const inscriptions = await client.sgs_inscription.findMany({
            where : {
                eleve_id : eleveId,
                registration_status : 'A',
                sgs_salle_classe : {
                    annee_scolaire_id : anneescolaire.id
                }
            }
        });
        if (inscriptions.length === 0 || inscriptions.length > 1) return null;
        return ToInscriptionDO(inscriptions[0]);
    }
    catch(error) {
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getEleveInscriptionsByAnneeScolaire(eleveId : string, anneeScolaireId : string) : Promise<InscriptionDO[]> {
    const functionName = "getEleveInscriptionsByAnneeScolaire - ";
    try {
        const listInscriptions:InscriptionDO[] = [];
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const inscriptions = await client.sgs_inscription.findMany({
            where : {
                eleve_id : eleveId,
                registration_status : 'A',
                sgs_salle_classe : {
                    annee_scolaire_id : anneeScolaireId
                }
            }
        });
        inscriptions.forEach(inscription => {
            listInscriptions.push(ToInscriptionDO(inscription));
        });
        return listInscriptions;
    }
    catch(error) {
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getEleveEvaluations(eleveId:string) : Promise<EvaluationDO[]> {
    const functionName = "getEleveEvaluations - ";
    try {
        const listEvaluations:EvaluationDO[] = [];
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const inscription = await getEleveCurrentInscription(eleveId);
        if (inscription === null) return [];
        const evaluations = await client.sgs_evaluation.findMany({
            where : {
                inscription_id : inscription.id,
                sgs_inscription : {
                    eleve_id : eleveId
                }
            }
        });
        evaluations.forEach(evaluation => {
            listEvaluations.push(ToEvaluationDO(evaluation));
        });
        return listEvaluations;
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getEleveAbsences(eleveId:string) : Promise<PresenceDO[]> {
    const functionName = "getEleveAbsences - ";
    try {
        const listAbsences:DisplayPresenceDO[] = [];
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const inscription = await getEleveCurrentInscription(eleveId);
        if (inscription === null) return [];
        const absences = await client.sgs_presence.findMany({
            where : {
                eleve_id : eleveId,
                attendance_status : 'A',
                sgs_instruction : {
                    sgs_salle_classe : {
                        id : inscription.salle_classe_id
                    }
                }
            },
            orderBy : [
                {
                    sgs_instruction : {
                        instruction_date : 'asc'
                    }
                }
            ]
        });
        return absences;
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getEleveOverview(eleveId:string) : Promise<OverviewEleveDO|null> {
    const functionName = "getEleveOverview - ";
          try {
            const connection:LSVRdbConnection = await checkConnection();
            if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
            const client:PrismaClient = connection.client;
            const eleve = await getEleveById(eleveId);
            if(!eleve || eleve === null) return null;
            return ToOverviewEleveDO(eleve);
    
        }
        catch(error:any) {
            throw new Error(ErrorOrigin + functionName + error.message);
        }
}
