type LevelStat = number | number[];

interface SkillReference {
    id: string;
    maxRank: number;
}

export interface Class {
    id: string;
    levellingDifficulty: number;
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
