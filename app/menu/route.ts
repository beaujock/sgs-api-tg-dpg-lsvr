import { getUserMenu } from "@/factories/menuFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest){
   //console.log("ROUTE: eleve");
    try {
        const searchParams = request.nextUrl.searchParams;
        const userID = searchParams.get('userID');
        if(!userID) return NextResponse.json("Requête invalide (utilisateur)", { status: 400 });
        console.log("user ID = ", userID);
        const body = await request.json();
        console.log("body = ", body);
        if(!body) return NextResponse.json("Requête invalide (corps de la requête)", { status: 400 });
        const menuRequest = {
            ecoleID: body.ecoleID,
            userType : body.userType
        };



        //const ecoleID = searchParams.get('ecoleID');
        if(!menuRequest.ecoleID) return NextResponse.json("Requête invalide (établissement scolaire)", { status: 400 });
        //const userType = searchParams.get('userType');
        if(!menuRequest.userType) return NextResponse.json("Requête invalide (type d'utilisateur)", { status: 400 });

        const menus = await getUserMenu(menuRequest.ecoleID, userID, menuRequest.userType);
        //console.log("menu = ", menus);
        return NextResponse.json({menu: menus}); 
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
