import { sgs_administration_epreuve } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export type AdminstrationEpreuveDO = {
    id                  : string;
    epreuve_id          : string;
    salle_classe_id     : string;
    administration_date : string;
    administrated_as    : string;
    max_grade_points    : Decimal;
    notes               : string;
}

export function ToAdminstrationEpreuveDO(adminepreuve : sgs_administration_epreuve) {
    return {
        id                  : adminepreuve.id,
        epreuve_id          : adminepreuve.epreuve_id,
        salle_classe_id     : adminepreuve.salle_classe_id,
        administration_date : adminepreuve.administration_date,
        administrated_as    : adminepreuve.administrated_as,
        max_grade_points    : adminepreuve.max_grade_points,
        notes               : adminepreuve.notes
    }
}