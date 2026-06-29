import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { InfoUserTokenDO } from "@/types/user/InfoUserTokenDO";
import { getUserTokenInfosById } from "@/factories/userFactory";

export async function GET(request:NextRequest){
   console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide", { status: 400 });
        console.log("user ID", userID);
        const userToken = await getUserTokenInfosById(userID);
        if (!userToken) return NextResponse.json("Informations de connexion manquantes - token", { status: 400 });
        console.log("user token", userToken);
        if (!userToken.token || !userToken.token_effective_date || !userToken.token_expiry_date) return NextResponse.json("Informations de connexion manquantes - token", { status: 400 });
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET;
        console.log("token secret : ", JWT_SECRET);
        const decodedPayload = jwt.verify(userToken.token,JWT_SECRET);
        //const tokenDetails = verifyToken(userToken.token);
        if (!decodedPayload) return NextResponse.json("Informations de connexion manquantes - token details", { status: 400 });
        console.log("token details : ", decodedPayload);
        console.log("token user : ", decodedPayload.user);
        console.log("token user roles : ", decodedPayload.user.roles);
        const isEleveRolePresent = decodedPayload.user.roles.includes('ELEVE');
        console.log("isEleveRolePresent: ", isEleveRolePresent);
        if (!(decodedPayload.user.roles).includes('ELEVE')) return NextResponse.json("Accès non authorisé - role", { status: 400 });
        const today = new Date(Date.now());
        console.log("today: ", today);
        console.log("Effetive date: ", userToken.token_effective_date);
        console.log("Expiry date: ", userToken.token_expiry_date);
        if ( (today < userToken.token_effective_date) || (today > userToken.token_expiry_date) ) return NextResponse.json("Accès non authorisé - Session expiré", { status: 400 });
        
        return NextResponse.json({token : decodedPayload}); 
    }
    catch(error){
        return NextResponse.json({message : error}, { status: 500 });
    }
}