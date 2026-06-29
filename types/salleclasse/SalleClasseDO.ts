import { sgs_salle_classe } from "@/lib/generated/prisma/client";

export type SalleClasseDO = {
    id                        : string;
    etablissement_scolaire_id : string;
    annee_scolaire_id         : string;
    classe_id                 : string;
    code                      : string;
    description               : string|null;
    notes                     : string|null;
}

export function ToSalleClasseDO(salleclasse : sgs_salle_classe) : SalleClasseDO {
    return {
        id                        : salleclasse.id,
        etablissement_scolaire_id : salleclasse.etablissement_scolaire_id,
        annee_scolaire_id         : salleclasse.annee_scolaire_id,
        classe_id                 : salleclasse.classe_id,
        code                      : salleclasse.code,
        description               : salleclasse.description,
        notes                     : salleclasse.notes
    }
}