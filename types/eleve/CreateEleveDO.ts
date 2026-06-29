export type CreateEleveDO = {
    matricule       : string;
    last_name       : string;
    first_name      : string;
    other_names     : string|null;
    preferred_name  : string|null;
    date_of_birth   : Date;
    gender          : string;
    phone_number    : string|null;
    email           : string|null;
    notes           : string|null;
    created_by      : string;
}
