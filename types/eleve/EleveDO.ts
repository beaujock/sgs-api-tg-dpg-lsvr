import { sgs_eleve } from "@/lib/generated/prisma/client";

export type EleveDO = {
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

export function ToEleveDO(eleve : sgs_eleve) : EleveDO {
    return {
        id              : eleve.id,
        matricule       : eleve.matricule,
        last_name       : eleve.last_name,
        first_name      : eleve.first_name,
        other_names     : eleve.other_names,
        preferred_name  : eleve.preferred_name,
        date_of_birth   : eleve.date_of_birth,
        gender          : eleve.gender,
        phone_number    : eleve.phone_number,
        email           : eleve.email,
        notes           : eleve.notes
    }
}

export function InitialsEleve(eleve : sgs_eleve) : string {
    return eleve.last_name[0].toUpperCase() + eleve.first_name[0].toUpperCase();
}