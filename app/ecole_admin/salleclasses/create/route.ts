import { NextRequest, NextResponse } from "next/server";
import { getUserAdminEcoleResource } from "@/factories/userFactory";
import { getEtablissementScolaireSalleClasses } from "@/factories/etablissementScolaireFactory";
import { ToOverviewSalleClasseDO } from "@/types/salleclasse/OverviewSalleClasseDO";
import { CreateSalleClasseDO } from "@/types/salleclasse/CreateSalleClasseDO";
import { createSalleClasse } from "@/factories/salleClasseFactory";

export async function POST(request:NextRequest){
   //console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide (utilisateur)", { status: 400 });
        const createSalleClasseData:CreateSalleClasseDO = await request.json();
        if (!createSalleClasseData || createSalleClasseData===null) return NextResponse.json("Requête invalide (données)", { status: 400 });
        const ecole = await getUserAdminEcoleResource(userID);
        if(!ecole) return NextResponse.json("Etablissement scolaire non disponible", { status: 400 });
        const salleclasse = await createSalleClasse(createSalleClasseData);
        return NextResponse.json({salleClasseCreated : salleclasse}); 
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}