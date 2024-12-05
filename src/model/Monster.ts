import { DiceRoll } from "./DiceRoll";

export interface Monster {
    id: string;
    health: DiceRoll;
    energy: DiceRoll;
    mana: DiceRoll;
    attacks: {
        name: string;
        attackSpeed: number;
        damage: DiceRoll;
    }[];
}
