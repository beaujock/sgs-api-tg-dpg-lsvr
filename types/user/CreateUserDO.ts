export type CreateUserDO = {
    user_name            : string;
    full_name            : string;
    email                : string;
    phone                : string|null;  
    notes                : string|null;
    created_by           : string;
}