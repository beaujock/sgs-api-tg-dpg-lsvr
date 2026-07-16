import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { sgs_eleve } from "@/lib/generated/prisma/client";


export type DisplayEleveDO = {
    id              : string;
    matricule       : string;
    full_name       : string;
    date_of_birth   : string;
    gender          : string;
    phone_number    : string|null;
    email           : string|null;
    notes           : string|null;
}

export async function ToDisplayEleveDO(eleve : sgs_eleve) : Promise<DisplayEleveDO> {
    
    let fullname:string = eleve.first_name;
    if ( !(!eleve.other_names || !eleve.other_names.trim()) ) fullname = fullname + eleve.other_names.split(" ")[0];
    if ( !(!eleve.preferred_name || !eleve.preferred_name.trim()) ) fullname = fullname + '"' + eleve.preferred_name.split(" ")[0] + '"';
    fullname = fullname + eleve.last_name;
    const dateOfBirth = format(eleve.date_of_birth, 'd MMMM yyyy', { locale: fr });
    return {
        id              : eleve.id,
        matricule       : eleve.matricule,
        full_name       : fullname,
        date_of_birth   : dateOfBirth,
        gender          : eleve.gender,
        phone_number    : eleve.phone_number,
        email           : eleve.email,
        notes           : eleve.notes
    }
}

export type EleveDisplayEleveDO = {
    matricule       : string;
    full_name       : string;
    phone_number    : string|null;
    email           : string|null;
}

export function ToEleveDisplayEleveDO(eleve : sgs_eleve) : EleveDisplayEleveDO {
    return {
        matricule   : eleve.matricule,
        full_name   : eleve.last_name + " " + eleve.first_name,
        phone_number: eleve.phone_number,
        email       : eleve.email
    }
}