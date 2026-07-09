import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { UserDO, ToDisplayUserDO } from "@/types/user/UserDO";
import { InfoUserTokenDO, ToInfoUserTokenDO } from "@/types/user/InfoUserTokenDO";
import { CreateUserDO } from "@/types/user/CreateUserDO";
import { InfoBasicEleveDO, ToInfoBasicEleveDO } from "@/types/eleve/InfoBasicEleveDO";
import { getEleveById } from "./eleveFactory";

const ErrorOrigin = "userFactory - ";

export async function getUser(login:string|null, password:string|null) : Promise<UserDO|null> {
    console.log("Entering GETUSER");
    try {
        let user;
        if (login ===null || password === null) return null; //login or pasword cannot be null
        const connection : LSVRdbConnection = await checkConnection();
        console.log("Connection : ",connection.connectionMessage);
        if (!connection.isConnected || !connection.client) throw new Error("Echec Connexion : " + connection.connectionMessage);
        const client : PrismaClient = connection.client;
        const userWithLogin = await client.sgs_user.findUnique({
            where : {user_name : login.toUpperCase()}
        });
        if (userWithLogin) {
            user = userWithLogin;
        }
        else {
            const userWithEmail = await client.sgs_user.findUnique({
            where :{email : login.toUpperCase()}
            });
            if (userWithEmail) {
                user = userWithEmail;
            }
            else user = null;
        };
        console.log("User : ", user);
        
        if (user === null) throw new Error("Utilisateur non trouvé");
        const bcrypt = require('bcrypt');
        const isPasswordValid = await bcrypt.compare(password, user.pwd_hash);
        if (!isPasswordValid) throw new Error("Nom d'utilisateur/email et/ou mot de passe incorrect(s)"); //invalid password
        return ToDisplayUserDO(user);
    }
    catch(error) {
        throw new Error("Echec - Recherche d'utilisateur : " + error);
    }
}

export async function createUser(userToCreate : CreateUserDO) : Promise<UserDO|null> {
    try {
        if (userToCreate === null) throw new Error("Information manquantes: ");
        if (userToCreate.full_name === null || userToCreate.email === null || userToCreate.pwd === null || userToCreate.created_by === null) {
            throw new Error("Information manquantes: ");
        }
        const connection : LSVRdbConnection = await checkConnection();
        if (!connection.isConnected || !connection.client) throw new Error("Echec Connexion : " + connection.connectionMessage);
        console.log("Connection message : ", connection.connectionMessage);
        const client : PrismaClient = connection.client;
        const saltRounds = Number(process.env.SALT_ROUNDS);
        console.log("Salt rounds : ", saltRounds);
        const bcrypt = require('bcrypt');
        console.log(" password : ", userToCreate.pwd);
        const hashedPassword = await bcrypt.hash(userToCreate.pwd, saltRounds);
        if (!hashedPassword) throw new Error("Echec création d'utilisateur");
        console.log("Hashed password : ", hashedPassword);
        const newUser = await client.sgs_user.create({
            data : {
                user_name : userToCreate.user_name.toUpperCase(),
                full_name : userToCreate.full_name,
                pwd_hash : hashedPassword,
                email : userToCreate.email.toUpperCase(),
                phone : userToCreate.phone,
                created_by : userToCreate.created_by,
                create_date : new Date(Date.now())
            }
        });
        if (!newUser) return null;
        return ToDisplayUserDO(newUser);
    }
    catch(error) {
        throw new Error("Echec création d'utilisateur : " +  error);
    }
}

export async function addUserSession(userID:string, token:string, effective_date : Date, expiry_date : Date) : Promise<boolean> {
  try {
    if (!userID || !token || !effective_date || !expiry_date) {
      console.log ("issue with user id or token or ExpiresAT")
      return false;
    }

    const connection: LSVRdbConnection = await checkConnection();
    if (!connection.isConnected || !connection.client) {
        throw new Error("La connexion à la base de données a échoué: " + connection.connectionMessage);
    };
    const client : PrismaClient = connection.client;
    const userUpdated = await client.sgs_user.update({
      where : {
        id : userID
      },
      data : {
        token : token,
        token_effective_time : effective_date,
        token_expiry_time : expiry_date
      }
    });
    if (!userUpdated) {
      //console.log("Echec : Ajout de session de l'utilisateur");
      return false;
    }
    return true;
  }
  catch(error) {
    throw new Error("La création de la session de l'utilisateur a échoué");
  }
}

export async function getUserRoles(userID : string) : Promise<string[]> {
    try {
        const userRoles : string[] = [];
        const connection : LSVRdbConnection = await checkConnection();
        if (!connection.isConnected || !connection.client) throw new Error("La connexion à la base de données a échoué: " + connection.connectionMessage);
        const client : PrismaClient = connection.client;
        const roles = await client.sgs_user_role.findMany({
            where : {
                user_id : userID,
                status : 'A'
            },
            include : {sgs_role : true}
        });
        roles.forEach(role => {
            userRoles.push(role.sgs_role.code)
        });
        return userRoles;
    }
    catch(error){
        throw new Error("Echec : Recherche de roles de l'utilisateur");
    }
}

export async function getUserTokenInfosById(userId : string) : Promise<InfoUserTokenDO|null> {
    const functionName = "getUserTokenInfosById - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const user = await client.sgs_user.findUnique({
            where : {
                id : userId
            }
        });
        if (!user) return null;
        return ToInfoUserTokenDO(user);
    }
    catch(error){
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function isValidTokenAndRoute(userId : string, route : string) : Promise<boolean> {
    const functionName = "isUserRouteAllowed - ";
    console.log("isUserRouteAllowed");
    try {
        const userTokenInfos = await getUserTokenInfosById(userId);
        console.log("userTokenInfos");
        if (!userTokenInfos) throw new Error(ErrorOrigin + functionName + "Accès non authorisé - Pas de jeton");
        if (!userTokenInfos.token || !userTokenInfos.token_effective_date || !userTokenInfos.token_expiry_date) throw new Error(ErrorOrigin + functionName + "Accès non authorisé - Jeton invalide");
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET;
        const decodedPayload = jwt.verify(userTokenInfos.token,JWT_SECRET);
        console.log("decodedPayload");
        if (!decodedPayload) throw new Error(ErrorOrigin + functionName + "Accès non authorisé - Jeton non décodé");
        console.log("good route ?");
        const today = new Date(Date.now());
        console.log("Token details", userTokenInfos);
        if ((today < userTokenInfos.token_effective_date) || (today > userTokenInfos.token_expiry_date)) throw new Error(ErrorOrigin + functionName + "Accès non authorisé - Jeton expiré");
        console.log("compare date ?");
        if (!(decodedPayload.user.roles).includes(route.toUpperCase())) return false;
        return true;
    }
    catch(error) {
        console.log("Error", (error as Error).name);
        throw new Error(ErrorOrigin + functionName + (error as Error).name);
    }
}

export async function getUserEleveResource(userId : string) : Promise<InfoBasicEleveDO|null> {
    console.log("getUserEleveResource");
    const functionName = "getUserEleveResource - ";
    try {
        const eleveIDs:string[] = [];
        const isUserAllowed = await isValidTokenAndRoute(userId, 'ELEVE');
        if (!isUserAllowed) return null;
        console.log("USER IS ALLOWED");
        const connection : LSVRdbConnection = await checkConnection();
        if (!connection.isConnected || !connection.client) throw new Error("La connexion à la base de données a échoué: " + connection.connectionMessage);
        const client : PrismaClient = connection.client;
        const userResources = await client.sgs_user_resource.findMany({
            where : {
                user_id : userId,
                status : 'A'
            },
            include : {
                sgs_resource : true
            }
        });
        console.log("USER resources", userResources);
        userResources.forEach(userResource => {
            if (userResource.sgs_resource.resource_type.toUpperCase() === 'ELEVE') eleveIDs.push(userResource.sgs_resource.resource_id);
        });
        if (eleveIDs.length === 0) return null;
        if (eleveIDs.length > 1) return null;
        console.log("Eleve IDs", eleveIDs);
        const eleve = await client.sgs_eleve.findUnique({
            where : {
                id : eleveIDs[0]
            }
        });
        console.log("Eleve", eleve);
        if (!eleve) return null;
        return ToInfoBasicEleveDO(eleve);
    }
    catch(error) {
        throw new Error(ErrorOrigin + functionName + error);
    }
}
