import { sgs_enseignant } from "@/lib/generated/prisma/client";

export type EnseignantDO = {
    id              : string;
    matricule       : string;
    last_name       : string;
    first_name      : string;
    other_names     : string|null;
    preferred_name  : string|null;
    date_of_birth   : Date;
    gender          : string;
    phone_number    : string|null;
    email           : string|null;
    notes           : string|null;
}

export function ToEnseignantDO(enseignant : sgs_enseignant) : EnseignantDO {
    return {
        id              : enseignant.id,
        matricule       : enseignant.matricule,
        last_name       : enseignant.last_name,
        first_name      : enseignant.first_name,
        other_names     : enseignant.other_names,
        preferred_name  : enseignant.preferred_name,
        date_of_birth   : enseignant.date_of_birth,
        gender          : enseignant.gender,
        phone_number    : enseignant.phone_number,
        email           : enseignant.email,
        notes           : enseignant.notes
    }
} 