type LevelStat = number | number[];

export interface Class {
    id: string;
    category: "class";
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
}
