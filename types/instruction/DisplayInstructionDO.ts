import { getInstructionDetails } from "@/factories/instructionFactory";
import { sgs_instruction } from "@/lib/generated/prisma/client";


export type DisplayInstructionDO = {
    id                    : string;
    salle_classe_code     : string;
    enseignant            : string|null;
    matiere               : string|null;
    description           : string|null;
    status                : string;
    type                  : string;
    instruction_date      : Date;
    start_time            : string;
    end_time              : string;
    notes                 : string|null;
}

export async function ToDisplayInstructionDO(instruction : sgs_instruction) : Promise<DisplayInstructionDO|null>  {
    try {
        const instructionDetails = await getInstructionDetails(instruction.id);
        if (instructionDetails === null) return null;
        //const matiere = (instructionDetails.sgs_matiere === null)?(null):(instructionDetails.sgs_matiere.short_name);
        //const enseignant = (instructionDetails.sgs_enseignant === null)?(null):(instructionDetails.sgs_enseignant.last_name + " " + instructionDetails.sgs_enseignant.first_name);
        return {
            id : instructionDetails.id,
            salle_classe_code : instructionDetails.sgs_salle_classe.code,
            enseignant : (instructionDetails.sgs_enseignant === null)?(null):(instructionDetails.sgs_enseignant.last_name + " " + instructionDetails.sgs_enseignant.first_name),
            matiere : (instructionDetails.sgs_matiere === null)?(null):(instructionDetails.sgs_matiere.short_name),
            description : instructionDetails.description,
            type : instructionDetails.lkp_instruction_type.display_value,
            status : instructionDetails.lkp_instruction_status.display_value,
            instruction_date : instructionDetails.instruction_date,
            start_time : new Date(instructionDetails.start_time).toISOString().slice(11, 16),
            end_time : new Date(instructionDetails.end_time).toISOString().slice(11, 16), 
            notes : instructionDetails.notes
        };
    }
    catch(error) {
        throw new Error("ToDisplayInstructionDO - " + error);
    }
}