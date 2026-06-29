type UserRolesPermissions = {
    id : string|null;
    name : string|null;
    roles : string[]|null;
}
export type ContextUserDO = {
    isAuthenticated : boolean,
    user : UserRolesPermissions|null
}