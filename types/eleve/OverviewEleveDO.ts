import { sgs_eleve } from "@/lib/generated/prisma/client";
import { DisplayAnneeScolaireDO } from "../anneescolaire/DisplayAnneeScolaireDO";
import { DisplayEvaluationDO } from "../evaluation/DisplayEvaluationDO";
import { EvaluationDO } from "../evaluation/EvaluationDO";
import { DisplayPresenceDO } from "../presence/DisplayPresenceDO";
import { DisplaySalleClasseDO } from "../salleclasse/DisplaySalleClasseDO";
import { DisplayEleveDO } from "./DisplayEleveDO";
import { EleveDO } from "./EleveDO";
import { getEleveAbsences, getEleveById, getEleveCurrentInscription, getEleveEvaluations } from "@/factories/eleveFactory";
import { getSalleClasseById } from "@/factories/salleClasseFactory";

export type OverviewEleveDO = {
    matricule               : string;
    full_name               : string;
    salle_classe_code       : string;
    number_absences         : number;
    number_evaluations      : number;
}

export async function ToOverviewEleveDO(eleve:sgs_eleve|EleveDO) : Promise<OverviewEleveDO> {
    let salleclassecode:string = "Inconnu";
    const inscription = await getEleveCurrentInscription(eleve.id);
    if (inscription !== null) {
        const salleclasse = await getSalleClasseById(inscription.salle_classe_id);
        if (salleclasse !== null) salleclassecode = salleclasse.code;
    }
    const absences = await getEleveAbsences(eleve.id);
    const evaluations = await getEleveEvaluations(eleve.id);
    return {
        matricule           : eleve.matricule,
        full_name           : eleve.last_name + " " + eleve.first_name,
        salle_classe_code   : salleclassecode,
        number_absences     : absences.length,
        number_evaluations  : evaluations.length
    }
}