import { sgs_classe } from "@/lib/generated/prisma/client";


export type ClasseDO = {
    id               : string;
    niveau_id        : string;
    serie_id         : string|null;
    full_name        : string;
    short_name       : string|null;
    code             : string;
    description      : string|null;
    notes            : string|null;
}

export function ToClasseDO(classe : sgs_classe) : ClasseDO {
    return {
        id               : classe.id,
        niveau_id        : classe.niveau_id,
        serie_id         : classe.serie_id,
        full_name        : classe.full_name,
        short_name       : classe.short_name,
        code             : classe.code,
        description      : classe.description,
        notes            : classe.notes
    }
}
