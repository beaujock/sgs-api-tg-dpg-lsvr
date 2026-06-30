import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { InfoUserTokenDO } from "@/types/user/InfoUserTokenDO";
import { getUserEleveResource } from "@/factories/userFactory";

export async function GET(request:NextRequest){
   //console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide", { status: 400 });
        const eleve = await getUserEleveResource(userID);
        return NextResponse.json({eleve : eleve}); 
    }
    catch(error){
        return NextResponse.json({message : error}, { status: 500 });
    }
}