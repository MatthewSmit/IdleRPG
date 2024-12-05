import { DiceRoll } from "./DiceRoll";

export type ItemCategory = WeaponItem["category"];

export interface Item {
    id: string;
    category: ItemCategory;
}

export interface WeaponItem extends Item {
    category: "weapon";
    weaponSkill: string;
    attackBonus: number;
    damage: DiceRoll;
}
