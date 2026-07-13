import { sgs_annee_scolaire } from "@/lib/generated/prisma/client";
import { getYear } from "date-fns";

export type AnneeScolaireDO = {
    id               : string;
    start_date       : Date;
    end_date         : Date;
    notes            : string|null
}

export function ToAnneeScolaireDO(anneescolaire : sgs_annee_scolaire) : AnneeScolaireDO {
    return {
        id               : anneescolaire.id,
        start_date       : anneescolaire.start_date,
        end_date         : anneescolaire.end_date,
        notes            : anneescolaire.notes
    }
}

export function ShortLabelAnneeScolaire(anneescolaire : sgs_annee_scolaire) : string {
    if (getYear(anneescolaire.start_date) === getYear(anneescolaire.end_date) ) return getYear(anneescolaire.end_date).toString();
    return getYear(anneescolaire.start_date).toString() + "-" + getYear(anneescolaire.end_date).toString();
}