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

export interface ItemState {
    id: string;
}

interface Inventory {
    leftHand?: ItemState;
    bag: ItemState[];
}

export interface CharacterData {
    name: string;
    currentClass: string;
    classes: { [key: string]: CharacterClassData };
    race: string;
    skills: {
        [key: string]: {
            rank: number;
            level: number;
        };
    };
    stats: Stats;
    health: number;
    energy: number;
    mana: number;
    maxHealth: number;
    maxEnergy: number;
    maxMana: number;
    inventory: Inventory;
}
