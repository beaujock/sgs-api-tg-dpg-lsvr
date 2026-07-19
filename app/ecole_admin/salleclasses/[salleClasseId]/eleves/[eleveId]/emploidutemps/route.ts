import { NextRequest, NextResponse } from "next/server";
import { getUserAdminEcoleResource } from "@/factories/userFactory";
import { getSalleClasseEmploiDuTemps } from "@/factories/salleClasseFactory";
import {getEmploiDuTempsOverview } from "@/factories/emploiDuTempsFactory";

export async function GET(request:NextRequest, { params }: { params: Promise<{salleClasseId: string, eleveId:string }> }){
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide (utilisateur inconnu)", { status: 400 });
        const salleClasseID = (await params).salleClasseId;
        if(!salleClasseID) return NextResponse.json("Requête invalide (classe inconnu)", { status: 400 });
        const eleveID = (await params).eleveId;
        if(!eleveID) return NextResponse.json("Requête invalide (eleve inconnu)", { status: 400 });
        const ecole = await getUserAdminEcoleResource(userID);
        if(!ecole) return NextResponse.json("Etablissement scolaire non disponible", { status: 400 });
        const emploidutemps = await getSalleClasseEmploiDuTemps(salleClasseID);
        if(!emploidutemps) return NextResponse.json("Emploi du temps non disponible pour la classe", { status: 400 });
        const eleveEmploiDuTempsOverview = await getEmploiDuTempsOverview(emploidutemps.id);
        return NextResponse.json({eleveEmploiDuTempsOverview: eleveEmploiDuTempsOverview}); 
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}