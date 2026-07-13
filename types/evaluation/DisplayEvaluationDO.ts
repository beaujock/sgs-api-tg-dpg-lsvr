import { Decimal } from "@prisma/client/runtime/client";


export type DisplayEvaluationDO = {
    epreuve_code        : string;
    evaluation_date     : Date;
    eleve               : string;
    matiere             : string;
    points_obtained     : Decimal;
    max_points          : Decimal;
    graded_by           : string;
    observations        : string|null;
}
