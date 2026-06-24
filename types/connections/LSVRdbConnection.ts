import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";

export type LSVRdbConnection = {
    isConnected: boolean;
    connectionMessage: unknown;
    client: PrismaClient | null;
}