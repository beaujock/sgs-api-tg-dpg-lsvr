import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { InfoUserTokenDO } from "@/types/user/InfoUserTokenDO";
import { getUserAdminEcoleResource, getUserEleveResource } from "@/factories/userFactory";
import { getEtablissementScolaireOverview, getEtablissementScolaireSalleClasses } from "@/factories/etablissementScolaireFactory";
import { OverviewSalleClasseDO, ToOverviewSalleClasseDO } from "@/types/salleclasse/OverviewSalleClasseDO";

export async function GET(request:NextRequest, { params }: { params: Promise<{SalleClasseID: string }> }){
   //console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide (utilisateur inconnu)", { status: 400 });
        const salleClasseID = (await params).SalleClasseID;
        if(!salleClasseID) return NextResponse.json("Requête invalide (classe inconnu)", { status: 400 });
        const ecole = await getUserAdminEcoleResource(userID);
        if(!ecole) return NextResponse.json("Etablissement scolaire non disponible", { status: 400 });
        const salleclasses = await getEtablissementScolaireSalleClasses(ecole.id);
        //const listSalleClassesOveriew:OverviewSalleClasseDO[] = [];
        const overviewPromises = salleclasses.map(async sc => {
            const overviewSC = await ToOverviewSalleClasseDO(sc);
            //console.log("Overview = ", overviewSC);
            return overviewSC; // return the value directly
        });
        const listSalleClassesOveriew = await Promise.all(overviewPromises);

        return NextResponse.json({overviewSalleClasses : listSalleClassesOveriew}); 
    }
    catch(error){
        return NextResponse.json({message : error}, { status: 500 });
    }
}