import { sgs_menu_item } from "@/lib/generated/prisma/client";

export type MenuItemDO = {
    icon    : string|null;
    label   : string;
    href    : string;
}

export function ToMenuItemDO(menuitem : sgs_menu_item) : MenuItemDO {
    return {
        icon    : menuitem.icon,
        label   : menuitem.label,
        href    : menuitem.href
    }
}