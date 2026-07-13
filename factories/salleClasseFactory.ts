import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { SalleClasseDO, ToSalleClasseDO } from "@/types/salleclasse/SalleClasseDO";
import { sgs_salle_classe } from "@/lib/generated/prisma/client";
import { OverviewSalleClasseDO } from "@/types/salleclasse/OverviewSalleClasseDO";
import { EleveDO, ToEleveDO } from "@/types/eleve/EleveDO";
import { MatiereDO, ToMatiereDO } from "@/types/matiere/MatiereDO";
import { EnseignantDO, ToEnseignantDO } from "@/types/enseignant/EnseignantDO";
import { AdministrationEpreuveDO, ToAdministrationEpreuveDO } from "@/types/evaluation/AdministrationEpreuveDO";
import { EleveOverviewSalleClasseDO } from "@/types/salleclasse/OverviewSalleClasseDO";
import { EmploiDuTempsDO, ToEmploiDutempsDO } from "@/types/emploidutemps/EmploiDuTempsDO";
import { DisplayInstructionDO } from "@/types/instruction/DisplayInstructionDO";

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
        throw new Error(ErrorOrigin + functionName + error);
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

export async function getEleveOverviewSalleClasse(salleClasseId : string) : Promise<EleveOverviewSalleClasseDO|null> {
    const functionName = "getEleveOverviewSalleClasse - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const salleclasse = await getSalleClasseById(salleClasseId);
        if (salleclasse === null) throw new Error(connection.connectionMessage as string);
        //const listEleves:EleveDO[] = [];
        const listMatieres:MatiereDO[] = [];
        const listEnseignants:EnseignantDO[] = [];
        const listEpreuves:AdministrationEpreuveDO[] = [];
        /*
        const inscriptions = await client.sgs_inscription.findMany({
            where : {
                salle_classe_id : salleclasse.id,
                registration_status : 'A'
            },
            include : {
                sgs_eleve : true
            }
        });
        inscriptions.forEach(inscription => {
            listEleves.push(ToEleveDO(inscription.sgs_eleve));
        });
        */
        const salleclassematieres = await client.sgs_salle_classe_matiere.findMany({
            where : {
                salle_classe_id : salleclasse.id,
                active : true
            },
            include : {
                sgs_matiere : true,
            }
        });
        salleclassematieres.forEach(scm =>{
            listMatieres.push(ToMatiereDO(scm.sgs_matiere));
        });

        const enseignantPortfolio = await client.sgs_portfolio_enseignant.findMany({
            where : {
                sgs_salle_classe_matiere : {
                    salle_classe_id : salleclasse.id
                },
                active : true
            },
            include : {
                sgs_enseignant : true
            }
        });
        enseignantPortfolio.forEach(portfolio => {
            listEnseignants.push(ToEnseignantDO(portfolio.sgs_enseignant));
        });

        const adminEpreuves = await client.sgs_administration_epreuve.findMany({
            where : {
                salle_classe_id : salleclasse.id
            },
            include : {
                sgs_epreuve : true
            }
        });
        adminEpreuves.forEach(adminepreuve => {
            listEpreuves.push(ToAdministrationEpreuveDO(adminepreuve));
        });

        return {
            salleclasse_code : salleclasse.code,
            matieres : listMatieres,
            enseignants : listEnseignants,
            epreuves : listEpreuves
        }

    }
    catch(error:any){
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

