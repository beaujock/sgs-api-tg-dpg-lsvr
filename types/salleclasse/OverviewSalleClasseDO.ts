import { MatiereDO } from "../matiere/MatiereDO";
import { EnseignantDO } from "../enseignant/EnseignantDO";
import { AdministrationEpreuveDO } from "../evaluation/AdministrationEpreuveDO";
import { EleveDO } from "../eleve/EleveDO";

export type OverviewSalleClasseDO = {
    salleclasse_code : string;
    eleves : EleveDO[];
    matieres : MatiereDO[];
    enseignants : EnseignantDO[];
    epreuves : AdministrationEpreuveDO[];
}

export type EleveOverviewSalleClasseDO = {
    salleclasse_code : string;
    matieres : MatiereDO[];
    enseignants : EnseignantDO[];
    epreuves : AdministrationEpreuveDO[];
}