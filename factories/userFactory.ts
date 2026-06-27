import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { DisplayUserDO, ToDisplayUserDO } from "@/types/user/DisplayUserDO";

export async function getUser(login:string|null, password:string|null) : Promise<DisplayUserDO|null> {
    try {
        if (login ===null || password === null) return null; //login or pasword cannot be null
        const connection : LSVRdbConnection = await checkConnection();
        if (!connection.isConnected || !connection.client) throw new Error("Echec Connexion : " + connection.connectionMessage);
        const client : PrismaClient = connection.client;
        const userWithLogin = await client.sgs_user.findUnique({
            where : {user_name : login}
        });
        const userWithEmail = await client.sgs_user.findUnique({
        where :{email : login}
        });
        const user = (userWithLogin === null)?(userWithEmail):(userWithLogin);
        if (!user) throw new Error("Nom d'utilisateur/email et/ou mot de passe incorrect(s)"); //invalid login/email
        const bcrypt = require('bcrypt');
        const isPasswordValid = await bcrypt.compare(password, user.pwd_hash);
        if (!isPasswordValid) throw new Error("Nom d'utilisateur/email et/ou mot de passe incorrect(s)"); //invalid password
        return ToDisplayUserDO(user);
    }
    catch(error) {
        throw new Error("Echec - Recherche d'utilisateur : " + error);
    }
}