

import { sgs_annee_scolaire } from "@/lib/generated/prisma/client";
import { getYear } from "date-fns";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export type DisplayAnneeScolaireDO = {
    id               : string;
    start_date       : string;
    end_date         : string;
    notes            : string|null
}


export function ToDisplayAnneeScolaireDO(annescolaire : sgs_annee_scolaire) : DisplayAnneeScolaireDO {
    return {
        id              : annescolaire.id,
        start_date      : format(annescolaire.start_date,'d MMMM yyyy', { locale: fr }),
        end_date        : format(annescolaire.end_date,'d MMMM yyyy', { locale: fr }),
        notes           : annescolaire.notes
    }
}