import { sgs_niveau } from "@/lib/generated/prisma/client";


export type NiveauDO = {
    id               : string;
    enseignement_id  : string;
    full_name        : string;
    short_name       : string|null;
    code             : string;
    ranking          : number;
    description      : string|null;
    notes            : string|null;
}

export function ToNiveauDO(niveau : sgs_niveau) : NiveauDO {
    return {
        id               : niveau.id,
        enseignement_id  : niveau.enseignement_id,
        full_name        : niveau.full_name,
        short_name       : niveau.short_name,
        code             : niveau.code,
        ranking          : niveau.ranking,
        description      : niveau.description,
        notes            : niveau.notes
    }
}