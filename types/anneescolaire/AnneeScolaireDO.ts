import { sgs_annee_scolaire } from "@/lib/generated/prisma/client";

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