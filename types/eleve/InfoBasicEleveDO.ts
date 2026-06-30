import { sgs_eleve } from "@/lib/generated/prisma/client";
import { getEleveCurrentInscription } from "@/factories/eleveFactory";
import { getSalleClasseById } from "@/factories/salleClasseFactory";

export type InfoBasicEleveDO = {
    matricule           : string;
    phone_number        : string|null;
    email               : string|null;
    current_salle_classe: string|null;
}

export async function ToInfoBasicEleveDO(eleve : sgs_eleve) : Promise<InfoBasicEleveDO|null> {
    let salleClasse = null;
    const currentInscription = await getEleveCurrentInscription(eleve.id);
    if (currentInscription != null) {
        const currentSalleClasse = await getSalleClasseById(currentInscription?.salle_classe_id);
        if (currentSalleClasse) salleClasse = currentSalleClasse.code;
    }
    return {
        matricule           : eleve.matricule,
        phone_number        : eleve.phone_number,
        email               : eleve.email,
        current_salle_classe: salleClasse
    }
}