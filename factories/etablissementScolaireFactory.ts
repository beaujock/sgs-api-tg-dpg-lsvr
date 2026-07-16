import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { EtablissementScolaireDO, ToEtablissementScolaireDO } from "@/types/etablissementscolaire/EtablissementScolaireDO";
import { OverviewEtablissementScolaireDO } from "@/types/etablissementscolaire/OverviewEtablissementScolaireDO";
import { SalleClasseDO, ToSalleClasseDO } from "@/types/salleclasse/SalleClasseDO";
import { getAnneeScolaireFromDate } from "./anneeScolaireFactory";
import { EleveDO, ToEleveDO } from "@/types/eleve/EleveDO";
import { EnseignantDO, ToEnseignantDO } from "@/types/enseignant/EnseignantDO";
import { sgs_etablissement_scolaire } from "@/lib/generated/prisma/client";

const ErrorOrigin = "etablissementScolaireFactory - ";

export async function getEtablissementScolaireById(ecoleId:string) : Promise<EtablissementScolaireDO|null> {
    const functionName = "getEtablissementScolaireById - ";
        try {
            const connection:LSVRdbConnection = await checkConnection();
            if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
            const client:PrismaClient = connection.client;
            const ecole = await client.sgs_etablissement_scolaire.findUnique({
                where : {
                    id : ecoleId
                }
            });
            if (!ecole || ecole === null) return null;
            return ToEtablissementScolaireDO(ecole);
        }
        catch(error:any) {
            throw new Error(ErrorOrigin + functionName + error.message);
        }
}

export async function getEtablissementScolaireSalleClasses(ecoleId:string) : Promise<SalleClasseDO[]> {
    const functionName = "getEtablissementScolaireSalleClasse - ";
    try {
            const listSalleClasses:SalleClasseDO[] = [];
            const connection:LSVRdbConnection = await checkConnection();
            if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
            const client:PrismaClient = connection.client;
            const anneescolaire = await getAnneeScolaireFromDate(new Date(Date.now()));
            if (!anneescolaire || anneescolaire === null) throw new Error("Année scolaire non trouvé");
            const salleclasses = await client.sgs_salle_classe.findMany({
                where : {
                    annee_scolaire_id : anneescolaire.id,
                    etablissement_scolaire_id : ecoleId
                },
                orderBy : [
                    {
                        sgs_classe:  {
                            sgs_niveau : {
                                ranking : 'asc'
                            }
                        }
                    },
                    {
                        code : 'asc'
                    }
                ]
            });
            salleclasses.forEach(salleclasse => {
                listSalleClasses.push(ToSalleClasseDO(salleclasse));
            });
            return listSalleClasses;
        }
        catch(error:any) {
            throw new Error(ErrorOrigin + functionName + error.message);
        }
}

export async function getEtablissementScolaireEleves(ecoleId:string) : Promise<EleveDO[]> {
    const functionName = "getEtablissementScolaireEleves - ";
    try {
            const listEleves:EleveDO[] = [];
            const connection:LSVRdbConnection = await checkConnection();
            if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
            const client:PrismaClient = connection.client;
            const anneescolaire = await getAnneeScolaireFromDate(new Date(Date.now()));
            if (!anneescolaire || anneescolaire === null) throw new Error("Année scolaire non trouvé");
            const inscriptions= await client.sgs_inscription.findMany({
                where : {
                    sgs_salle_classe : {
                        etablissement_scolaire_id : ecoleId,
                        annee_scolaire_id : anneescolaire.id,
                    },
                    registration_status : 'A'
                },
                include : {
                    sgs_eleve : true
                }
            });
            inscriptions.forEach(inscription => {
                listEleves.push(ToEleveDO(inscription.sgs_eleve));
            });
            return listEleves;
        }
        catch(error:any) {
            throw new Error(ErrorOrigin + functionName + error.message);
        }
}

export async function getEtablissementScolaireEnseignants(ecoleId:string) : Promise<EleveDO[]> {
    const functionName = "getEtablissementScolaireEnseignants - ";
    try {
            const listEnseignants:EnseignantDO[] = [];
            const connection:LSVRdbConnection = await checkConnection();
            if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
            const client:PrismaClient = connection.client;
            const anneescolaire = await getAnneeScolaireFromDate(new Date(Date.now()));
            if (!anneescolaire || anneescolaire === null) throw new Error("Année scolaire non trouvé");
            const portfolios= await client.sgs_portfolio_enseignant.findMany({
                where : {
                    sgs_salle_classe_matiere : {
                        sgs_salle_classe : {
                            annee_scolaire_id : anneescolaire.id,
                            etablissement_scolaire_id : ecoleId
                        }
                    },
                    active : true
                },
                include : {
                    sgs_enseignant : true
                }
            });
            portfolios.forEach(portfolio => {
                const enseignant = ToEnseignantDO(portfolio.sgs_enseignant);
                if (!listEnseignants.includes(enseignant)) listEnseignants.push(enseignant);
            });
            return listEnseignants;
        }
        catch(error:any) {
            throw new Error(ErrorOrigin + functionName + error.message);
        }
}

export async function getEtablissementScolaireOverview(ecoleId : string) : Promise<OverviewEtablissementScolaireDO> {
     const functionName = "getEtablissementScolaireOverview - ";
        try {
            const ecole = await getEtablissementScolaireById(ecoleId);
            if (ecole === null) throw new Error("Etablissement scolaire non trouvé")
            const salleclasses = await getEtablissementScolaireSalleClasses(ecoleId);
            const eleves = await getEtablissementScolaireEleves(ecoleId);
            const enseignants = await getEtablissementScolaireEnseignants(ecoleId);
            return {
                name                    : ecole.short_name,
                number_salle_classes    : salleclasses.length,
                number_eleves           : eleves.length,
                number_enseignants      : enseignants.length
            };
        }
        catch(error:any) {
            throw new Error(ErrorOrigin + functionName + error.message);
        }
}