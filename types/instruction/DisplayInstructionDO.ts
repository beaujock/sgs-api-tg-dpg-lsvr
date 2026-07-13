

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