import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { sgs_instruction } from "@/lib/generated/prisma/client";
import { DetailedDisplayInstructionDO } from "@/types/instruction/DetailedDisplayInstructionDO";
import { DisplayInstructionDO } from "@/types/instruction/DisplayInstructionDO";
import { InstructionDO, ToInstructionDO } from "@/types/instruction/InstructionDO";

const ErrorOrigin = "instructionFactory - ";

export async function getInstructionById(instructionId : string) : Promise<InstructionDO|null> {
    const functionName = "getInstructionById - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const instruction = await client.sgs_instruction.findUnique({
            where : {
                id : instructionId
            }
        });
        if (!instruction) return null;
        return ToInstructionDO(instruction);
    }
    catch(error:any){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getInstructionDetails(instructionId : string) : Promise<any|null> {
    const functionName = "getInstructionDetails - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const instruction = await client.sgs_instruction.findUnique({
            where : {
                id : instructionId
            },
            include : {
                sgs_enseignant : true,
                sgs_matiere : true,
                sgs_presence : true,
                sgs_salle_classe : true
            }
        });
        if (!instruction) return null;
        return instruction;
    }
    catch(error:any){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getInstructionLabel(instructionId : string) : Promise<string|null> {
    const functionName = "getInstructionLabel - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const instruction = await client.sgs_instruction.findUnique({
            where : {
                id : instructionId
            },
            include : {
                sgs_enseignant : true,
                sgs_matiere : true,
                sgs_presence : true,
                sgs_salle_classe : true
            }
        });
        if (!instruction) return null;
        let label:string = instruction.sgs_salle_classe.code;
        if (instruction.sgs_matiere !== null) label = label + " - " + instruction.sgs_matiere.code;
        if (instruction.sgs_enseignant !== null) label = label + " - " + instruction.sgs_enseignant.last_name + " " + instruction.sgs_enseignant.first_name;
        if (instruction.sgs_matiere === null) label = label + " - " + instruction.description;
        return label;
    }
    catch(error:any){
        throw new Error(ErrorOrigin + functionName + error);
    }
}


export async function getSalleClasseInstructions(salleClasseId:string) : Promise<DisplayInstructionDO[]> {
    const functionName = "getSalleClasseEmploiDuTemps - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(connection.connectionMessage as string);
        const client:PrismaClient = connection.client;
        const listInstructions:DisplayInstructionDO[] = []
        const instructions = await client.sgs_instruction.findMany({
            where : {
                salle_classe_id : salleClasseId
            },
            include : {
                sgs_salle_classe : true,
                sgs_enseignant : true,
                sgs_matiere :true,
                lkp_instruction_status : true,
                lkp_instruction_type : true
            }
        });
        if (!instructions || instructions.length === 0) return [];
        instructions.forEach(instruction => {
            listInstructions.push({
                id : instruction.id,
                salle_classe_code : instruction.sgs_salle_classe.code,
                enseignant : (instruction.sgs_enseignant === null)?(null):(instruction.sgs_enseignant.last_name + " " + instruction.sgs_enseignant.first_name),
                matiere : (instruction.sgs_matiere === null)?(null):(instruction.sgs_matiere.code),
                description : instruction.description,
                status : instruction.lkp_instruction_status.display_value,
                type : instruction.lkp_instruction_type.display_value,
                instruction_date : instruction.instruction_date,
                start_time : new Date(instruction.start_time).toISOString().slice(11, 16),
                end_time : new Date(instruction.end_time).toISOString().slice(11, 16),
                notes : instruction.notes
            });
        });
        return listInstructions;
    }
    catch(error:any){
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}