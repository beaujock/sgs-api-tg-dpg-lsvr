import { PrismaClient } from "@/lib/generated/prisma/client";
import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { DetailedDisplayElementEmploiDuTempsDO } from "@/types/emploidutemps/DetailedDisplayElementEmploiDuTempsDO";
import { getDay, format, parse } from "date-fns";


async function getSalleClasseDaySchedule(salleclasseId:string, date : Date|null) : Promise<DetailedDisplayElementEmploiDuTempsDO[]> {
const connection:LSVRdbConnection = await checkConnection();
if(!connection.isConnected || !connection.client) {console.log("Mauvaise connexion"); return [];}
const client:PrismaClient = connection.client;
let theDay:Date;
if (date === null) theDay = new Date(Date.now()); else theDay = date;
const dayOfWeek = getDay(theDay);
console.log("Day of the week : ", dayOfWeek);
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
    include : {
        lkp_jour : true,
        sgs_enseignant : true,
        sgs_matiere : true
    },
    orderBy :{
        start_time : 'asc'
    }
});
if (elements.length === 0) return [];
elements.forEach(element => {
    listElements.push({
        jour : element.lkp_jour.display_value,
        matiere : (element.sgs_matiere === null)?(null):(element.sgs_matiere.short_name),
        enseignant : (element.sgs_enseignant === null)?(null):(element.sgs_enseignant.last_name + " " + element.sgs_enseignant.first_name),
        description : element.description,
        start_time : new Date(element.start_time).toISOString().slice(11, 16),
        end_time : new Date(element.end_time).toISOString().slice(11, 16)
    });
});
return listElements;

}

const results = await getSalleClasseDaySchedule('d9cc9101-5797-4cf1-a377-83581a25e1dd', null);
console.log("Resultats = ",results);