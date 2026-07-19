import { sgs_epreuve } from "@/lib/generated/prisma/client";

export type EpreuveDO = {
    id                         : string;
    matiere_id                 : string;
    classe_id                  : string|null;
    code                       : string;
    submitted_by               : string|null;
    date_submitted             : Date|null;
    notes                      : string|null;
}

export function ToEpreuveDO(epreuve : sgs_epreuve) : EpreuveDO {
    return {
        id                         : epreuve.id,
        matiere_id                 : epreuve.matiere_id,
        classe_id                  : epreuve.classe_id,
        code                       : epreuve.code,
        submitted_by               : epreuve.submitted_by,
        date_submitted             : epreuve.date_submitted,
        notes                      : epreuve.notes
    }
}