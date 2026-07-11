import { sgs_evaluation } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export type EvaluationDO = {
    id                         : string;
    inscription_id             : string;
    administration_epreuve_id  : string;
    grade_points_obtained      : Decimal;
    notes                      : string|null;
}

export function ToEvaluationDO(evaluation : sgs_evaluation) : EvaluationDO {
    return {
        id                         : evaluation.id,
        inscription_id             : evaluation.inscription_id,
        administration_epreuve_id  : evaluation.administration_epreuve_id,
        grade_points_obtained      : evaluation.grade_points_obtained,
        notes                      : evaluation.notes
    }
}