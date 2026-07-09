import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { DetailedDisplayElementEmploiDuTempsDO } from "@/types/emploidutemps/DetailedDisplayElementEmploiDuTempsDO";
import { sgs_element_emploi_du_temp } from "@/lib/generated/prisma/client";
import { getDay } from "date-fns";

const ErrorOrigin = "emploiDuTempsFactory - ";

export async function ToDetailedDisplayElementEmploiDuTempsDO(element : sgs_element_emploi_du_temp) : Promise<DetailedDisplayElementEmploiDuTempsDO|null> {
    const functionName = "ToDetailedDisplayElementEmploiDuTempsDO - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        const elementDetails = await client.sgs_element_emploi_du_temp.findUnique({
            where : {id : element.id},
            include : {
                sgs_enseignant : true,
                sgs_matiere : true,
                sgs_emploi_du_temp : {
                    include : {
                        sgs_salle_classe : true
                    }
                },
                lkp_jour : true
            }
        });
        if (elementDetails === null) return null;
        return {
            salle_classe : elementDetails.sgs_emploi_du_temp.sgs_salle_classe.code,
            jour : elementDetails.lkp_jour.display_value,
            matiere : (elementDetails.sgs_matiere === null)?(null):(elementDetails.sgs_matiere.short_name),
            enseignant : (elementDetails.sgs_enseignant === null)?(null):(elementDetails.sgs_enseignant.last_name + " " + elementDetails.sgs_enseignant.first_name),
            description : elementDetails.description,
            start_time : new Date(elementDetails.start_time).toISOString().slice(11, 16),
            end_time : new Date(elementDetails.end_time).toISOString().slice(11, 16),
        };
    }
    catch(error) {
        throw new Error(ErrorOrigin + functionName + error);
    }
}

export async function getSalleClasseDaySchedule(salleclasseId:string, date : Date|null) : Promise<DetailedDisplayElementEmploiDuTempsDO[]> {
    const functionName = "getSalleClasseDaySchedule - ";
    try {
        const connection:LSVRdbConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
        const client:PrismaClient = connection.client;
        let theDay:Date;
        if (date === null) theDay = new Date(Date.now()); else theDay = date;
        const dayOfWeek = getDay(theDay);
        const listElements:DetailedDisplayElementEmploiDuTempsDO[] = [];
        const elements = await client.sgs_element_emploi_du_temp.findMany({
            where : {
                sgs_emploi_du_temp : {
                    salle_classe_id : salleclasseId
                },
                lkp_jour : {
                    numeric_value : dayOfWeek
                },
                start_date : {
                    lte : theDay
                },
                end_date : {
                    gte : theDay
                }
            },
            orderBy :{
                start_time : 'asc'
            }
        });
        if (elements.length === 0) return [];
        elements.forEach(async element => {
            const detailElement = await ToDetailedDisplayElementEmploiDuTempsDO(element);
            if (detailElement != null ) listElements.push(detailElement);
            
        });
        return listElements;
    }
    catch(error) {
        throw new Error(ErrorOrigin + functionName + error);
    }
}

