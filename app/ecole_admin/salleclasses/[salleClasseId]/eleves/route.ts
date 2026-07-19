import { NextRequest, NextResponse } from "next/server";
import { getUserAdminEcoleResource } from "@/factories/userFactory";


import { getSalleClasseEleves } from "@/factories/salleClasseFactory";
import { ToOverviewEleveDO } from "@/types/eleve/OverviewEleveDO";

export async function GET(request:NextRequest, { params }: { params: Promise<{salleClasseId: string }> }){
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide (utilisateur inconnu)", { status: 400 });
        const salleClasseID = (await params).salleClasseId;
        if(!salleClasseID) return NextResponse.json("Requête invalide (classe inconnu)", { status: 400 });
        const ecole = await getUserAdminEcoleResource(userID);
        if(!ecole) return NextResponse.json("Etablissement scolaire non disponible", { status: 400 });
        const eleves = await getSalleClasseEleves(salleClasseID);
        const elevesOverviewPromises = eleves.map(async eleve => {
            const overviewEleve = await ToOverviewEleveDO(eleve);
            return overviewEleve;
        });
        const elevesOverview = await Promise.all(elevesOverviewPromises);
        return NextResponse.json({elevesOverview : elevesOverview}); 
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}