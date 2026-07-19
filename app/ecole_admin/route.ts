import { NextRequest, NextResponse } from "next/server";
import { getUserAdminEcoleResource } from "@/factories/userFactory";
import { getEtablissementScolaireOverview } from "@/factories/etablissementScolaireFactory";

export async function GET(request:NextRequest){
   //console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide", { status: 400 });
        const ecole = await getUserAdminEcoleResource(userID);
        if(!ecole) return NextResponse.json("Resource non disponible", { status: 400 });
        const overviewEcole = await getEtablissementScolaireOverview(ecole.id);
        return NextResponse.json({ecoleOverview: overviewEcole}); 
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}