import { sgs_instruction } from "@/lib/generated/prisma/client";

export type InstructionDO = {
    id                    : string;
    salle_classe_id       : string;
    enseignant_id         : string|null;
    matiere_id            : string|null;
    description           : string|null;
    instruction_status    : string;
    instruction_type      : string;
    instruction_date      : Date;
    start_time            : Date;
    end_time              : Date;
    notes                 : string|null;
}

export function ToInstructionDO(instruction : sgs_instruction) : InstructionDO {
    return {
        id                    : instruction.id,
        salle_classe_id       : instruction.salle_classe_id,
        enseignant_id         : instruction.enseignant_id,
        matiere_id            : instruction.matiere_id,
        description           : instruction.description,
        instruction_status    : instruction.instruction_status,
        instruction_type      : instruction.instruction_type,
        instruction_date      : instruction.instruction_date,
        start_time            : instruction.start_time,
        end_time              : instruction.end_time,
        notes                 : instruction.notes
    }
}