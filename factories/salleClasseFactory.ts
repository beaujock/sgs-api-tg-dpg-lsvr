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

export async function getSalleClasseEmploiDuTemps(salleClasseId:string) : Promise<SalleClasseDO|null> {
    const functionName = "getSalleClasseEmploiDuTemps - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const emploidutemps = await client.sgs_emploi_du_temp.findMany({
            where : {
                salle_classe_id : salleClasseId
            },
            include : {
                sgs_salle_classe : true
            }
        });
        if (!emploidutemps || emploidutemps.length === 0 || emploidutemps.length > 1) return null;
        return ToSalleClasseDO(emploidutemps[0].sgs_salle_classe);
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function ToOverviewSalleClasseDO(salleclasseId : string) : Promise<OverviewSalleClasseDO|null> {
    const functionName = "ToOverviewSalleClasseDO - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const salleclasse = await getSalleClasseById(salleclasseId);
        if (salleclasse === null) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const listEleves:EleveDO[] = [];
        const listMatieres:MatiereDO[] = [];
        const listEnseignants:EnseignantDO[] = [];
        const listEpreuves:AdministrationEpreuveDO[] = [];
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
            number_eleves : listEleves.length,
            matieres : listMatieres,
            enseignants : listEnseignants,
            epreuves : listEpreuves
        }

    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}