import { NextRequest, NextResponse } from "next/server";
import { getUserEleveResource, isValidTokenAndRoute } from "@/factories/userFactory";
import { getEleveCurrentInscription } from "@/factories/eleveFactory";
import { getSalleClasseEmploiDuTemps } from "@/factories/salleClasseFactory";
import { getEmploiDuTempsOverview } from "@/factories/emploiDuTempsFactory";

export async function GET(request:NextRequest){
   //console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide", { status: 400 });
        const validTokenRoute = await isValidTokenAndRoute(userID,'ELEVE');
        if (!validTokenRoute) return NextResponse.json("Requête non authorisée", { status: 401 });
        const eleve = await getUserEleveResource(userID);
        if (eleve === null ) return NextResponse.json("Elève inaccessible", { status: 404 });
        const inscription = await getEleveCurrentInscription(eleve.id);
        if (inscription === null) return NextResponse.json("Inscription inaccessible", { status: 404 });
        const emploidutemps = await getSalleClasseEmploiDuTemps(inscription.salle_classe_id);
        if (emploidutemps === null) return NextResponse.json("Emploi du temps inaccessible", { status: 404 });
        const overViewEmploiDuTemps = await getEmploiDuTempsOverview(emploidutemps.id);
        return NextResponse.json({overViewEmploiDuTemps : overViewEmploiDuTemps, emploidutemps : emploidutemps});
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}