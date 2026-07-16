import { sgs_etablissement_scolaire } from "@/lib/generated/prisma/client";


export type EtablissementScolaireDO = {
    id                    : string;
    full_name             : string;
    short_name            : string;
    establishment_date    : Date|null;
    code                  : string;
    primary_contact_name  : string|null;
    secondary_contact_name: string|null;
    contact_infos         : string|null;
    phone_number          : string|null;
    email                 : string|null;
    website               : string|null;
    notes                 : string|null;
}

export function ToEtablissementScolaireDO(ecole : sgs_etablissement_scolaire) : EtablissementScolaireDO {
    return {
        id                    : ecole.id,
        full_name             : ecole.full_name,
        short_name            : ecole.short_name,
        establishment_date    : ecole.establishment_date,
        code                  : ecole.code,
        primary_contact_name  : ecole.primary_contact_name,
        secondary_contact_name: ecole.secondary_contact_name,
        contact_infos         : ecole.contact_infos,
        phone_number          : ecole.phone_number,
        email                 : ecole.email,
        website               : ecole.website,
        notes                 : ecole.notes
    }
}