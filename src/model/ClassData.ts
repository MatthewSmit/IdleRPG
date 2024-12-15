import { DiceRollData } from "./DiceRollData";

type LevelStat = number | number[];

interface SkillReference {
    id: string;
    maxRank: number;
}

export interface ClassData {
    id: string;
    levellingDifficulty: number;
    health: DiceRollData;
    mana: DiceRollData;
    energy: DiceRollData;
    levelStats: {
        strength: LevelStat;
        speed: LevelStat;
        agility: LevelStat;
        dexterity: LevelStat;
        stamina: LevelStat;
        wisdom: LevelStat;
        intelligence: LevelStat;
        charisma: LevelStat;
    };
    skills: SkillReference[];
}
