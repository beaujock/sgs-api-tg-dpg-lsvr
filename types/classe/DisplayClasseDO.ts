import { sgs_classe } from "@/lib/generated/prisma/client";


export type DisplayClasseDO = {
    id               : string;
    niveau           : string;
    serie            : string|null;
    full_name        : string;
    short_name       : string|null;
    code             : string;
    description      : string|null;
    notes            : string|null;
}

/*
export async function ToDisplayClasseDO (classe : sgs_classe) : Promise<DisplayClasseDO> {
    
}
*/