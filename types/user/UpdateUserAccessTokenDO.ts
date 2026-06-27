export type UpdateUserAccessTokenDO = {
    id                   : string;
    token                : string;
    token_effective_time : Date;
    token_expiry_time    : Date|null;
}