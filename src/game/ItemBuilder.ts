import { data } from "../Data";
import type { WeaponItemData } from "../model/ItemData";
import { type Item, Weapon } from "./Item";

export function createItem(itemKey: string) {
    const itemData = data.item[itemKey];
    let item: Item;
    switch (itemData.category) {
        case "weapon":
            item = new Weapon(<WeaponItemData>itemData);
            break;
    }
    return item;
}
