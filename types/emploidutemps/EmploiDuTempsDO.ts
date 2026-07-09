import { sgs_emploi_du_temp } from "@/lib/generated/prisma/client";

export type EmploiDuTempsDO = {
    id                : string;
    salle_classe_id   : string;
    notes             : string|null;         
}

export function ToEmploiDutempsDO(emploidutemps : sgs_emploi_du_temp) : EmploiDuTempsDO {
    return {
        id              : emploidutemps.id,
        salle_classe_id : emploidutemps.salle_classe_id,
        notes           : emploidutemps.notes
    }
}