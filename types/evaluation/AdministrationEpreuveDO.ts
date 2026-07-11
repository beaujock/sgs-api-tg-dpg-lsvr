import { sgs_administration_epreuve } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export type AdministrationEpreuveDO = {
    id                  : string;
    epreuve_id          : string;
    salle_classe_id     : string|null;
    administration_date : Date;
    administrated_as    : string|null;
    max_grade_points    : Decimal;
    notes               : string|null;
}

export function ToAdministrationEpreuveDO(adminEpreuve : sgs_administration_epreuve) : AdministrationEpreuveDO {
    return {
        id                  : adminEpreuve.id,
        epreuve_id          : adminEpreuve.epreuve_id,
        salle_classe_id     : adminEpreuve.salle_classe_id,
        administration_date : adminEpreuve.administration_date,
        administrated_as    : adminEpreuve.administrated_as,
        max_grade_points    : adminEpreuve.max_grade_points,
        notes               : adminEpreuve.notes
    }
}