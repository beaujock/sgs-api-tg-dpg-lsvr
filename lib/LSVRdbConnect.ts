import { LSVRdbConnection } from "@/types/connections/LSVRdbConnection";
import { prisma } from "./prisma";

export async function checkConnection() : Promise<LSVRdbConnection> {
    //console.log("Checking Connection");
    try {
        await prisma.$queryRaw`SELECT 1`;
        return {
            isConnected: true,
            connectionMessage: "You are connected to TCV Database!",
            client: prisma
        }
    }
    catch (error) {
        console.log("ERROR : ", error);
        return {
            isConnected: false,
            connectionMessage: "Connection to the TCV Database has failed : " + error,
            client: null
        }
    }
}