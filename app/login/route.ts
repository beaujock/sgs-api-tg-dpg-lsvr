import { NextRequest, NextResponse } from "next/server";
import { DisplayUserDO } from "@/types/user/DisplayUserDO";
import { getUser } from "@/factories/userFactory";

export async function POST(request:NextRequest) {
    try {
        request.headers.set("Access-Control-Allow-Origin", "*");
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const loginRequest = {
            user_name : body.user_name,
            password : body.password
        };
        if (!loginRequest.user_name || !loginRequest.password) return NextResponse.json("Informations de connexion manquantes", { status: 400 });
        const user:DisplayUserDO|null = await getUser(loginRequest.user_name, loginRequest.password);
        if (!user) return NextResponse.json("Utilisateur non trouvé", { status: 404 });
        const cookie_name = process.env.COOKIE_NAME!;
        const expiry_date_time = new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN!) * 60 * 60 * 1000);
    }
    catch(error) {
        return NextResponse.json({message : error}, { status: 500 });
    }
}