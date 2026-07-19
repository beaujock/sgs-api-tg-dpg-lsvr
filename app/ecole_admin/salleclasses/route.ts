import { NextRequest, NextResponse } from "next/server";
import { getUserAdminEcoleResource } from "@/factories/userFactory";
import { getEtablissementScolaireSalleClasses } from "@/factories/etablissementScolaireFactory";
import { ToOverviewSalleClasseDO } from "@/types/salleclasse/OverviewSalleClasseDO";

export async function GET(request:NextRequest){
   //console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide", { status: 400 });
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

        return NextResponse.json({salleClassesOverview : listSalleClassesOveriew}); 
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}