import { MatiereDO } from "../matiere/MatiereDO";
import { EnseignantDO } from "../enseignant/EnseignantDO";
import { AdministrationEpreuveDO } from "../evaluation/AdministrationEpreuveDO";
import { EleveDO } from "../eleve/EleveDO";
import { sgs_salle_classe } from "@/lib/generated/prisma/client";
import { getSalleClasseEleves, getSalleClasseEnseignants, getSalleClasseEpreuveAdministres, getSalleClasseMatieres } from "@/factories/salleClasseFactory";
import { SalleClasseDO } from "./SalleClasseDO";

export type OverviewSalleClasseDO = {
    salleclasse_code            : string;
    number_eleves               : number;
    number_matieres             : number;
    number_enseignants          : number;
    number_epreuves_administres : number;
}

export async function ToOverviewSalleClasseDO(salleclasse : sgs_salle_classe|SalleClasseDO) : Promise<OverviewSalleClasseDO> {
    //console.log("SalleClasse ", salleclasse);
    const eleves = await getSalleClasseEleves(salleclasse.id);
    //console.log("Eleves = ", eleves);
    const matieres = await getSalleClasseMatieres(salleclasse.id);
    //console.log("matieres = ", matieres);
    const enseignants = await getSalleClasseEnseignants(salleclasse.id);
    //console.log("Enseignants = ", enseignants);
    const epreuvesadministres = await getSalleClasseEpreuveAdministres(salleclasse.id);
    //console.log("ElevEpreuveses = ", epreuvesadministres);
    return {
        salleclasse_code            : salleclasse.code,
        number_eleves               : eleves.length,
        number_matieres             : matieres.length,
        number_enseignants          : enseignants.length,
        number_epreuves_administres : epreuvesadministres.length
    }
}
