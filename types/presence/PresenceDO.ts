import { sgs_presence } from "@/lib/generated/prisma/client";

export type PresenceDO = {
    id                    : string;
    instruction_id        : string;
    eleve_id              : string;
    attendance_status     : string;
    reason_absence        : string|null;
    attendance_note       : string|null;
    notes                 : string|null;
}

export function ToPresenceDO(presence : sgs_presence) : PresenceDO {
    return {
        id                    : presence.id,
        instruction_id        : presence.instruction_id,
        eleve_id              : presence.eleve_id,
        attendance_status     : presence.attendance_status,
        reason_absence        : presence.reason_absence,
        attendance_note       : presence.attendance_note,
        notes                 : presence.notes
    }
}