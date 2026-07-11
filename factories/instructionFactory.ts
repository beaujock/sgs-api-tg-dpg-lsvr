import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { sgs_instruction } from "@/lib/generated/prisma/client";
import { DetailedDisplayInstructionDO } from "@/types/instruction/DetailedDisplayInstructionDO";

const ErrorOrigin = "instructionFactory - ";

export async function ToDetailedDisplayInstructionDO(instruction : sgs_instruction) : Promise<DetailedDisplayInstructionDO|null>  {
    const functionName = "ToDetailedDisplayInstructionDO - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const instructionDetails = await client.sgs_instruction.findUnique({
            where : {
                id : instruction.id,
            },
            include : {
                sgs_salle_classe : true,
                sgs_enseignant : true,
                sgs_matiere : true,
                lkp_instruction_status : true,
                lkp_instruction_type : true
            }
        });
        if (instructionDetails === null) return null;
        //const matiere = (instructionDetails.sgs_matiere === null)?(null):(instructionDetails.sgs_matiere.short_name);
        //const enseignant = (instructionDetails.sgs_enseignant === null)?(null):(instructionDetails.sgs_enseignant.last_name + " " + instructionDetails.sgs_enseignant.first_name);
        return {
            salleClasse : instructionDetails.sgs_salle_classe.code,
            enseignant : (instructionDetails.sgs_enseignant === null)?(null):(instructionDetails.sgs_enseignant.last_name + " " + instructionDetails.sgs_enseignant.first_name),
            matiere : (instructionDetails.sgs_matiere === null)?(null):(instructionDetails.sgs_matiere.short_name),
            description : instructionDetails.description,
            type : instructionDetails.lkp_instruction_type.display_value,
            status : instructionDetails.lkp_instruction_status.display_value,
            date : instructionDetails.instruction_date,
            start_time : new Date(instructionDetails.start_time).toISOString().slice(11, 16),
            end_time : new Date(instructionDetails.end_time).toISOString().slice(11, 16), 
            notes : instructionDetails.notes
        };
    }
    catch(error) {
        throw new Error(ErrorOrigin + functionName + error);
    }
}