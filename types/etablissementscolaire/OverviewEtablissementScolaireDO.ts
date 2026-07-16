import { getEtablissementScolaireEleves, getEtablissementScolaireEnseignants, getEtablissementScolaireSalleClasses } from "@/factories/etablissementScolaireFactory";
import { sgs_etablissement_scolaire } from "@/lib/generated/prisma/client";

export type OverviewEtablissementScolaireDO = {
    name                    : string;
    number_salle_classes    : number,
    number_eleves           : number,
    number_enseignants      : number,
}

export async function ToOverviewEtablissementScolaireDO(ecole : sgs_etablissement_scolaire) : Promise<OverviewEtablissementScolaireDO> {
    const salleclasses = await getEtablissementScolaireSalleClasses(ecole.id);
    const eleves = await getEtablissementScolaireEleves(ecole.id);
    const enseignants = await getEtablissementScolaireEnseignants(ecole.id);
    return {
        name                    : ecole.short_name,
        number_salle_classes    : salleclasses.length,
        number_eleves           : eleves.length,
        number_enseignants      : enseignants.length
    }
}