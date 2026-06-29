import { sgs_user } from "@/lib/generated/prisma/client";

export type InfoUserTokenDO = {
    token                  : string|null;
    token_effective_date   : Date|null;
    token_expiry_date      : Date|null;
}

export function ToInfoUserTokenDO(user : sgs_user) : InfoUserTokenDO {
    return {
        token                   : user.token,
        token_effective_date    : user.token_effective_time,
        token_expiry_date       : user.token_expiry_time
    }
}