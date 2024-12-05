import { DiceRoll } from "./DiceRoll";

type LevelStat = number | number[];

interface SkillReference {
    id: string;
    maxRank: number;
}

export interface Class {
    id: string;
    levellingDifficulty: number;
    health: DiceRoll;
    mana: DiceRoll;
    energy: DiceRoll;
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
