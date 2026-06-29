import { sgs_user } from "@/lib/generated/prisma/client";

export type UserDO = {
    id                   : string;
    user_name            : string;
    full_name            : string;
    email                : string;
    phone                : string|null;    
    notes                : string|null;  
}

export function ToDisplayUserDO(user : sgs_user) : UserDO {
    return {
        id                   : user.id,
        user_name            : user.user_name,
        full_name            : user.full_name,
        email                : user.email,
        phone                : user.phone,
        notes                : user.notes
    }
}