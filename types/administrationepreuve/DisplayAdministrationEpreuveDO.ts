
import { sgs_administration_epreuve } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { AdminstrationEpreuveDO } from "./AdministrationEpreuveDO";
import { getEpreuveById } from "@/factories/evaluationFactory";
import { getSalleClasseById } from "@/factories/salleClasseFactory";
import { SalleClasseDO } from "../salleclasse/SalleClasseDO";
import { getMatiereById } from "@/factories/enseignementFactory";
import { format } from "date-fns";
import { fr } from "date-fns/locale";


export type DisplayAdminstrationEpreuveDO = {
    id                  : string;
    epreuve             : string;
    salle_classe        : string|null;
    administration_date : string;
    administrated_as    : string;
    max_grade_points    : Decimal;
    notes               : string|null;
}

export async function ToDisplayAdminstrationEpreuveDO(adminepreuve:sgs_administration_epreuve|AdminstrationEpreuveDO) : Promise<DisplayAdminstrationEpreuveDO|null> {
    const epreuve = await getEpreuveById(adminepreuve.epreuve_id);
    if(!epreuve || epreuve === null) return null;
    const matiere = await getMatiereById(epreuve.matiere_id);
    if(!matiere || matiere === null) return null;
    let salleclasse:SalleClasseDO|null = null;
    if (adminepreuve.salle_classe_id !== null) salleclasse = await getSalleClasseById(adminepreuve.salle_classe_id);
    return {
        id                  : adminepreuve.id,
        epreuve             : matiere.short_name + " - " + epreuve.code,
        salle_classe        : (salleclasse == null)?(null):(salleclasse.code),
        administration_date : format(adminepreuve.administration_date,'d MMMM yyyy', { locale: fr }),
        administrated_as    : adminepreuve.administrated_as,
        max_grade_points    : adminepreuve.max_grade_points,
        notes               : adminepreuve.notes
    }
}