import { DiceRollData } from "./DiceRollData";

export interface MonsterInstanceData {
    id: string;
    level: number;
    health: number;
    energy: number;
    mana: number;
    maxHealth: number;
    maxEnergy: number;
    maxMana: number;
    attacks: {
        name: string;
        attackSpeed: number;
        attackModifier: number;
        damage: DiceRollData;
    }[];
    dodge: number;
    armour: number;
}
