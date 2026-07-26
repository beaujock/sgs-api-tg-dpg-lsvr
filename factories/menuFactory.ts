import { checkConnection } from "@/lib/LSVRdbConnect";
import { LSVRdbConnection } from "@/types/connection/LSVRdbConnection";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { MenuDO } from "@/types/menu/menuDO";
import { MenuItemDO, ToMenuItemDO } from "@/types/menu/MenuItemDO";
import { getUserRoles } from "./userFactory";

const ErrorOrigin = "menuFactory - ";

export async function getMenuItems(menuId:string) : Promise<MenuItemDO[]> {
    const functionName = "getUserMenu - ";
        try {
            const listItems:MenuItemDO[] = [];
            const connection:LSVRdbConnection = await checkConnection();
            if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
            const client:PrismaClient = connection.client;
            const items = await client.sgs_menu_item.findMany({
                where : {
                    menu_id : menuId,
                    active : true
                },
                orderBy : [
                    {
                        rank : 'asc'
                    }
                ]
            });
            //console.log("menu items", items)
            items.forEach(item => {
                listItems.push(ToMenuItemDO(item));
            });
            return listItems;
        }
        catch(error){
            throw new Error(ErrorOrigin + functionName + error);
        }
}

export async function getUserMenu(ecoleId:string, userId:string, userType:string) : Promise<MenuDO[]> {
    const functionName = "getUserMenu - ";
        try {
            //const listMenus:MenuDO[] = [];
            const connection:LSVRdbConnection = await checkConnection();
            if(!connection.isConnected || !connection.client) throw new Error(ErrorOrigin + functionName + connection.connectionMessage);
            const client:PrismaClient = connection.client;
            const roles = await getUserRoles(userId);
            //console.log("roles : ", roles);
            if (roles.length === 0) return [];
            if (!roles.includes(userType.toUpperCase())) return [];
            const menus = await client.sgs_menu.findMany({
                where : {
                   etablissement_scolaire_id : ecoleId,
                   sgs_role : {
                    code : userType
                   },
                    active : true
                },
                orderBy : [
                    {
                        rank : 'asc'
                    }
                ]
            });
            //console.log("menu : ", menus);
            const PromisedMenu = menus.map(async menu => {
                const menuItems = await getMenuItems(menu.id);
                return {
                    title : menu.label,
                    items : menuItems
                }
            });

            const listMenus = await Promise.all(PromisedMenu);

            //console.log("list menus : ", listMenus);
            return listMenus;
        }
        catch(error){
            throw new Error(ErrorOrigin + functionName + error);
        }
}