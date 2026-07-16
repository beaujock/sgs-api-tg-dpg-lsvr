import { sgs_serie } from "@/lib/generated/prisma/client";


export type SerieDO = {
    id               : string;
    enseignement_id  : string;
    full_name        : string;
    short_name       : string|null;
    code             : string;
    description      : string|null;
    notes            : string|null;
}

export function ToSerieDO(serie : sgs_serie) : SerieDO {
    return {
        id               : serie.id,
        enseignement_id  : serie.enseignement_id,
        full_name        : serie.full_name,
        short_name       : serie.short_name,
        code             : serie.code,
        description      : serie.description,
        notes            : serie.notes
    }
}