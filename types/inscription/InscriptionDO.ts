import { sgs_inscription } from "@/lib/generated/prisma/client";

export type InscriptionDO = {
    id                      : string;
    salle_classe_id         : string;
    eleve_id                : string;
    registration_date       : Date;
    registration_status     : string;
    status_notes            : string|null;
    notes                   : string|null;
}

export function ToInscriptionDO(inscription : sgs_inscription) : InscriptionDO {
    return {
        id                      : inscription.id,
        salle_classe_id         : inscription.salle_classe_id,
        eleve_id                : inscription.eleve_id,
        registration_date       : inscription.registration_date,
        registration_status     : inscription.registration_status,
        status_notes            : inscription.status_notes,
        notes                   : inscription.notes
    }
}