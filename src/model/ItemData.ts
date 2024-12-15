import { DiceRollData } from "./DiceRollData";

export type ItemCategory = WeaponItemData["category"];

export interface ItemData {
    id: string;
    category: ItemCategory;
}

export interface WeaponItemData extends ItemData {
    category: "weapon";
    weaponSkill: string;
    attackBonus: number;
    damage: DiceRollData;
}
