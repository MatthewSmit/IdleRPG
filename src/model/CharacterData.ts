export interface CharacterClassData {
    level: number;
    xp: number;
}

export interface Stats {
    strength: number;
    speed: number;
    agility: number;
    dexterity: number;
    stamina: number;
    wisdom: number;
    intelligence: number;
    charisma: number;
}

export interface CharacterData {
    name: string;
    currentClass: string;
    classes: { [key: string]: CharacterClassData };
    stats: Stats;
}
