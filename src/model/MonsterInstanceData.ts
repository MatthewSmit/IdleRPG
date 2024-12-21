import { DiceRollData } from "./DiceRollData";

export interface MonsterAttackData {
    name: string;
    attackSpeed: number;
    attackModifier: number;
    damage: DiceRollData;
}

export interface MonsterInstanceData {
    id: string;
    level: number;
    health: number;
    energy: number;
    mana: number;
    maxHealth: number;
    maxEnergy: number;
    maxMana: number;
    attacks: MonsterAttackData[];
    dodge: number;
    armour: number;
}
