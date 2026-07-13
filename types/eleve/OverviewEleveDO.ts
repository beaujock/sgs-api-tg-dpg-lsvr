import { DisplayEvaluationDO } from "../evaluation/DisplayEvaluationDO";
import { EvaluationDO } from "../evaluation/EvaluationDO";

export type OverviewEleveDO = {
    full_name           : string;
    salle_classe_code   : string|null;
    evaluations         : EvaluationDO[];
}