import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { SalleClasseDO, ToSalleClasseDO } from "@/types/salleclasse/SalleClasseDO";
import { EleveDO, ToEleveDO } from "@/types/eleve/EleveDO";
import { MatiereDO, ToMatiereDO } from "@/types/matiere/MatiereDO";
import { EnseignantDO, ToEnseignantDO } from "@/types/enseignant/EnseignantDO";
import { AdministrationEpreuveDO, ToAdministrationEpreuveDO } from "@/types/evaluation/AdministrationEpreuveDO";

import { EmploiDuTempsDO, ToEmploiDutempsDO } from "@/types/emploidutemps/EmploiDuTempsDO";
import { OverviewSalleClasseDO, ToOverviewSalleClasseDO } from "@/types/salleclasse/OverviewSalleClasseDO";

const ErrorOrigin = "salleClasseFactory - ";

export async function getSalleClasseById(salleClasseId : string) : Promise<SalleClasseDO|null> {
    const functionName = "getSalleClasseById - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const salleclasse = await client.sgs_salle_classe.findUnique({
            where : {
                id : salleClasseId
            }
        });
        if (!salleclasse) return null;
        return ToSalleClasseDO(salleclasse);
    }
    catch(error:any){
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getSalleClasseEmploiDuTemps(salleClasseId:string) : Promise<EmploiDuTempsDO|null> {
    const functionName = "getSalleClasseEmploiDuTemps - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const emploidutemps = await client.sgs_emploi_du_temp.findMany({
            where : {
                salle_classe_id : salleClasseId
            }
        });
        if (!emploidutemps || emploidutemps.length === 0 || emploidutemps.length > 1) return null;
        return ToEmploiDutempsDO(emploidutemps[0]);
    }
    catch(error:any){
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getSalleClasseEleves(salleClasseId:string) : Promise<EleveDO[]> {
    const functionName = "getSalleClasseEleves - ";
    try {
        const listEleves:EleveDO[] = [];
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const inscriptions = await client.sgs_inscription.findMany({
            where : {
                salle_classe_id : salleClasseId,
                registration_status : 'A',
            },
            include : {
                sgs_eleve : true
            }
        });
        inscriptions.forEach(inscription => {
            listEleves.push(ToEleveDO(inscription.sgs_eleve));
        });
        return(listEleves);
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getSalleClasseMatieres(salleClasseId:string) : Promise<MatiereDO[]> {
    const functionName = "getSalleClasseMatieres - ";
    try {
        const listMatieres:MatiereDO[] = [];
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const salleclassematieres = await client.sgs_salle_classe_matiere.findMany({
            where : {
                salle_classe_id : salleClasseId,
                active : true
            },
            include : {
                sgs_matiere : true
            }
        });
        salleclassematieres.forEach(scm => {
            listMatieres.push(ToMatiereDO(scm.sgs_matiere));
        });
        return(listMatieres);
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getSalleClasseEnseignants(salleClasseId:string) : Promise<EnseignantDO[]> {
    const functionName = "getSalleClasseEnseignants - ";
    try {
        const listEnseignants:EnseignantDO[] = [];
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const portfolioenseignants = await client.sgs_portfolio_enseignant.findMany({
            where : {
                sgs_salle_classe_matiere : {
                    salle_classe_id : salleClasseId
                },
                active : true
            },
            include : {
                sgs_enseignant : true
            }
        });
        portfolioenseignants.forEach(pe => {
            listEnseignants.push(ToEnseignantDO(pe.sgs_enseignant));
        });
        return(listEnseignants);
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getSalleClasseEpreuveAdministres(salleClasseId:string) : Promise<AdministrationEpreuveDO[]> {
    const functionName = "getSalleClasseEpreuveAdministres - ";
    try {
        const listEpreuveAdministres:AdministrationEpreuveDO[] = [];
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const epruvesadministres = await client.sgs_administration_epreuve.findMany({
            where : {
                salle_classe_id : salleClasseId
            }
        });
        epruvesadministres.forEach(ea => {
            listEpreuveAdministres.push(ToAdministrationEpreuveDO(ea));
        });
        return(listEpreuveAdministres);
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getSalleClasseOverview(salleClasseId:string) : Promise<OverviewSalleClasseDO|null>
{
     const functionName = "getSalleClasseOverview - ";
      try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const salleclasse = await getSalleClasseById(salleClasseId);
        if(!salleclasse || salleclasse === null) return null;
        return ToOverviewSalleClasseDO(salleclasse);

    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}
