export type UpdateBaseUserInfosDO = {
    id                   : string;
    full_name            : string;
    email                : string;
    phone                : string|null;  
    modified_by          : string;
}