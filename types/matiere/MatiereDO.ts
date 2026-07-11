import { sgs_matiere } from "@/lib/generated/prisma/client";

export type MatiereDO = {
    id                        : string;
    full_name                 : string;
    short_name                : string|null;
    code                      : string;
    description               : string|null;
    notes                     : string|null;
}

export function ToMatiereDO(matiere : sgs_matiere) : MatiereDO {
    return {
        id           : matiere.id,
        full_name    : matiere.full_name,
        short_name   : matiere.short_name,
        code         : matiere.code,
        description  : matiere.description,
        notes        : matiere.notes
    }
}