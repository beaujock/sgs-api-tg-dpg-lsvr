import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
//import { prisma } from "./prisma";
import {prisma} from "./client";

export async function checkConnection() : Promise<LSVRdbConnection> {
    //console.log("Checking Connection");
    try {
        await prisma.$queryRaw`SELECT 1`;
        return {
            isConnected: true,
            connectionMessage: "Vous êtes connecté. !",
            client: prisma
        }
    }
    catch (error) {
        console.log("ERROR : ", error);
        return {
            isConnected: false,
            connectionMessage: "La tentative de connection a échoué" + error,
            client: null
        }
    }
}