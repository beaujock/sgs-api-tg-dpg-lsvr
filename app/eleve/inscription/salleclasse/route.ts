import { NextRequest, NextResponse } from "next/server";
import { isValidTokenAndRoute, getEleveUserEleve } from "@/factories/userFactory";
import { getEleveCurrentInscription } from "@/factories/eleveFactory";
import { ToOverviewSalleClasseDO } from "@/factories/salleClasseFactory";

export async function GET(request:NextRequest){
   //console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide", { status: 400 });
        const validTokenRoute = await isValidTokenAndRoute(userID,'ELEVE');
        if (!validTokenRoute) return NextResponse.json("Requête non authorisée", { status: 401 });
        const eleve = await getEleveUserEleve(userID);
        if (eleve === null ) return NextResponse.json("Elève inaccessible", { status: 404 });
        const inscription = await getEleveCurrentInscription(eleve.id);
        if (inscription === null) return NextResponse.json("Inscription inaccessible", { status: 404 });
        const overviewSalleClasse = await ToOverviewSalleClasseDO(inscription.salle_classe_id);
        return NextResponse.json({overviewSalleClasse : overviewSalleClasse});
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}