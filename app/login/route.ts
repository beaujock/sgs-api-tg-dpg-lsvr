import { NextRequest, NextResponse } from "next/server";
import { UserDO } from "@/types/user/UserDO";
import { getUser, getUserRoles, addUserSession} from "@/factories/userFactory";
import { generateToken } from "@/lib/auth";


export async function POST(request:NextRequest) {
    try {
        //request.headers.set("Access-Control-Allow-Origin", "*");
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const loginRequest = {
            user_name : body.user_name,
            password : body.password
        };
        console.log("request :", loginRequest);
        if (!loginRequest.user_name || !loginRequest.password) return NextResponse.json("Informations de connexion manquantes", { status: 400 });
        const user:UserDO|null = await getUser(loginRequest.user_name, loginRequest.password);
        console.log("User :", user);
        if (!user) return NextResponse.json("Utilisateur non trouvé", { status: 404 });
        const userRoles = await getUserRoles(user.id);
        const cookie_name = process.env.COOKIE_NAME;
        const expiry_date_time = new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN!) * 60 * 60 * 1000);
        const token = generateToken({
            "isAuthenticated" : true,
            "user" : {
                "id" : user.id,
                "name" : user.full_name,
                "roles" : userRoles
            }
        });
        const sessionAdded:boolean = await addUserSession(user.id, token, new Date(Date.now()), expiry_date_time);
        return NextResponse.json({ message: "Succès : Connexion réussie", session_added : sessionAdded, token : token, cookie_name: cookie_name, effective_date : new Date(Date.now()),  expiry_date : expiry_date_time}, { status: 200 });

    }
    catch(error) {
        return NextResponse.json({message : error}, { status: 500 });
    }
}