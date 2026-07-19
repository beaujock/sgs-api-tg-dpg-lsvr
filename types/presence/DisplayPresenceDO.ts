import { getEleveById } from "@/factories/eleveFactory";
import { getInstructionLabel } from "@/factories/instructionFactory";
import { sgs_presence } from "@/lib/generated/prisma/client";
import { PresenceDO } from "./PresenceDO";

export type DisplayPresenceDO = {
    id                    : string;
    instruction           : string;
    eleve                 : string;
    attendance_status     : string;
    reason_absence        : string|null;
    attendance_note       : string|null;
    notes                 : string|null;
}

export async function ToDisplayPresenceDO(presence : sgs_presence|PresenceDO) : Promise<DisplayPresenceDO|null> {
    try {
        const instructionLabel = await getInstructionLabel(presence.instruction_id);
        if (!instructionLabel || instructionLabel===null) return null;
        const eleve = await getEleveById(presence.eleve_id);
        if (!eleve || eleve===null) return null;
        return {
            id                  : presence.id,
            instruction         : instructionLabel,
            eleve               : eleve.last_name + " " + eleve.first_name,
            attendance_status   : presence.attendance_status,
            reason_absence      : presence.reason_absence,
            attendance_note     : presence.attendance_note,
            notes               : presence.notes
        }
    }
    catch(error:any) {
        throw new Error ("ToDisplayPresenceDO - " + error.message)
    }
}