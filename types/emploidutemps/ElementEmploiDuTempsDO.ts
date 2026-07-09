import { sgs_element_emploi_du_temp } from "@/lib/generated/prisma/client";

export type ElementEmploiDuTempsDO = {
    id                : string;
    emploi_du_temp_id : string;
    enseignant_id     : string|null;
    matiere_id        : string|null;
    jour              : string;
    start_date        : Date;
    end_date          : Date;
    start_time        : string;
    end_time          : string;
    notes             : string|null;
}

export function ToElementEmploiDuTempsDO(element : sgs_element_emploi_du_temp) : ElementEmploiDuTempsDO {
    return {
        id                : element.id,
        emploi_du_temp_id : element.emploi_du_temp_id,
        enseignant_id     : element.enseignant_id,
        matiere_id        : element.matiere_id,
        jour              : element.jour,
        start_date        : element.start_date,
        end_date          : element.end_date,
        start_time        : element.start_time.toString(),
        end_time          : element.end_time.toString(),
        notes             : element.notes
    }
}