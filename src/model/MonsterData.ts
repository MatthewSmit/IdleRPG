import { DiceRollData } from "./DiceRollData";

export interface MonsterData {
    id: string;
    baseLevel: number;
    health: DiceRollData;
    energy: DiceRollData;
    mana: DiceRollData;
    attacks: {
        name: string;
        attackSpeed: number;
        attackModifier: number;
        damage: DiceRollData;
    }[];
    dodge: number;
    armour?: number;
}
