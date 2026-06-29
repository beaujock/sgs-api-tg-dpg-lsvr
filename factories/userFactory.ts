import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { DisplayUserDO, ToDisplayUserDO } from "@/types/user/DisplayUserDO";
import { CreateUserDO } from "@/types/user/CreateUserDO";

export async function getUser(login:string|null, password:string|null) : Promise<DisplayUserDO|null> {
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

export async function createUser(userToCreate : CreateUserDO) : Promise<DisplayUserDO|null> {
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
      console.log ("issue with sure id or token or ExpiresAT")
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
