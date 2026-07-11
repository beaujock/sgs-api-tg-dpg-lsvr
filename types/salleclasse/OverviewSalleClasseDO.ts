import { MatiereDO } from "../matiere/MatiereDO";
import { EnseignantDO } from "../enseignant/EnseignantDO";
import { AdministrationEpreuveDO } from "../evaluation/AdministrationEpreuveDO";

export type OverviewSalleClasseDO = {
    salleclasse_code : string;
    number_eleves : number;
    matieres : MatiereDO[];
    enseignants : EnseignantDO[];
    epreuves : AdministrationEpreuveDO[];
}