import { DiceRollData } from "./DiceRollData";

export interface MonsterData {
    id: string;
    health: DiceRollData;
    energy: DiceRollData;
    mana: DiceRollData;
    attacks: {
        name: string;
        attackSpeed: number;
        damage: DiceRollData;
    }[];
}
