import { getAnneeScolaireById, getShortLabelAnneeScolaire } from "@/factories/anneeScolaireFactory";
import { getClasseById } from "@/factories/classeFactory";
import { getEtablissementScolaireById } from "@/factories/etablissementScolaireFactory";
import { sgs_salle_classe } from "@/lib/generated/prisma/client";


export type DisplaySalleClasseDO = {
    id                        : string;
    etablissement_scolaire    : string;
    annee_scolaire            : string;
    classe                    : string;
    code                      : string;
    description               : string|null;
    notes                     : string|null;
}

export async function ToDisplaySalleClasseDO(salleclasse : sgs_salle_classe) : Promise<DisplaySalleClasseDO|null> {
    const ecole = await getEtablissementScolaireById(salleclasse.etablissement_scolaire_id);
    const anneescolaireLabel = await getShortLabelAnneeScolaire(salleclasse.annee_scolaire_id);
    const classe = await getClasseById(salleclasse.classe_id);
    if (ecole==null || anneescolaireLabel===null || classe===null) return null;
    return {
        id                          : salleclasse.id,
        etablissement_scolaire      : ecole.full_name,
        annee_scolaire              : anneescolaireLabel,
        classe                      : classe.code,
        code                        : salleclasse.code,
        description                 : salleclasse.description,
        notes                       : salleclasse.notes
    } 
}