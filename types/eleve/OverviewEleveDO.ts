import { DisplayAnneeScolaireDO } from "../anneescolaire/DisplayAnneeScolaireDO";
import { DisplayEvaluationDO } from "../evaluation/DisplayEvaluationDO";
import { EvaluationDO } from "../evaluation/EvaluationDO";
import { DisplaySalleClasseDO } from "../salleclasse/DisplaySalleClasseDO";
import { DisplayEleveDO } from "./DisplayEleveDO";
import { EleveDO } from "./EleveDO";

export type OverviewEleveDO = {
    raw_info_eleve          : EleveDO,
    display_eleve           : DisplayEleveDO;
    display_salle_classe    : DisplaySalleClasseDO;
    display_annee_scolaire  : DisplayAnneeScolaireDO;
}