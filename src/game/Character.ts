import { MAX_LEVEL } from "../constants";
import {
    type CharacterClassData,
    type CharacterData,
} from "../model/CharacterData";
import { data } from "../Data.tsx";

export class Character {
    _data: CharacterData;

    public constructor(data: CharacterData) {
        this._data = data;
    }

    public get name() {
        return this._data.name;
    }

    public get class() {
        return data.class[this._data.currentClass];
    }

    public get classData() {
        return this._data.classes[this._data.currentClass];
    }

    public get allClasses() {
        const results = [];
        for (const classId of Object.keys(this._data.classes)) {
            if (this._data.classes[classId].level) {
                results.push(data.class[classId]);
            }
        }
        return results;
    }

    public get level() {
        return this.classData.level;
    }

    public get race() {
        return data.race[this._data.race];
    }

    public get totalLevel() {
        let level = 0;
        for (const classId in this._data.classes) {
            const classData = this._data.classes[classId];
            level += classData.level;
        }
        return level;
    }

    public get xp() {
        return this.classData.xp;
    }

    public get requiredXp() {
        return (
            10 *
            this.level *
            (95 + 5 * this.level) *
            (0.9 + this.totalLevel / 10) *
            this.class.levellingDifficulty
        );
    }

    public get health() {
        return this._data.health;
    }

    public get maxHealth() {
        return this._data.maxHealth;
    }

    public get energy() {
        return this._data.energy;
    }

    public get maxEnergy() {
        return this._data.maxEnergy;
    }

    public get mana() {
        return this._data.mana;
    }

    public get maxMana() {
        return this._data.maxMana;
    }

    public get stats() {
        return {
            ...this._data.stats,
        };
    }

    private calculateMaxSkillRank(id: string) {
        let maxRank = 0;
        for (const clas of this.allClasses) {
            maxRank = Math.max(
                maxRank,
                ...clas.skills
                    .filter((skill) => skill.id === id)
                    .map((skill) => skill.maxRank)
            );
        }
        return maxRank;
    }

    public get allSkills() {
        const result = [];
        for (const skill of Object.values(data.skill)) {
            result.push({
                id: skill.id,
                rank: this._data.skills[skill.id]?.rank ?? 0,
                maxRank: this.calculateMaxSkillRank(skill.id),
                level: this._data.skills[skill.id]?.level ?? 0,
            });
        }
        return result;
    }
}

interface ICharacterBuilderData {
    name: string;
    currentClass: string;
    classes: { [key: string]: number };
    race: string;
}

export function buildCharacter(
    builder: CharacterBuilder<ICharacterBuilderData>
): Character {
    const classes: { [key: string]: CharacterClassData } = {};
    for (const clas in builder._data.classes) {
        classes[clas] = {
            level: builder._data.classes[clas],
            xp: 0,
        };
    }

    const race = data.race[builder._data.race];

    const characterData: CharacterData = {
        name: builder._data.name,
        currentClass: builder._data.currentClass,
        classes,
        race: builder._data.race,
        skills: {},
        stats: {
            strength: 10,
            agility: 10,
            charisma: 10,
            dexterity: 10,
            intelligence: 10,
            speed: 10,
            stamina: 10,
            wisdom: 10,
        },
        health: race.baseHealth,
        maxHealth: race.baseHealth,
        energy: race.baseEnergy,
        maxEnergy: race.baseEnergy,
        mana: race.baseMana,
        maxMana: race.baseMana,
    };

    const start = data.start.filter(
        (x) =>
            x.race === characterData.race &&
            x.class === characterData.currentClass
    )[0];

    for (const skill of start.skills) {
        characterData.skills[skill] = {
            level: 1,
            rank: 1,
        };
    }

    // TODO: level up

    return new Character(characterData);
}

export class CharacterBuilder<T extends object> {
    readonly _data: T;

    constructor(data: T) {
        this._data = data;
    }

    static new(): CharacterBuilder<object> {
        return new CharacterBuilder({});
    }

    withName(name: string): CharacterBuilder<T & { name: string }> {
        return new CharacterBuilder({
            ...this._data,
            name,
        });
    }

    withClass(
        clas: string,
        level: number = 1
    ): CharacterBuilder<
        T & {
            currentClass: string;
            classes: { [key: string]: number };
        }
    > {
        if (level < 1 || level > MAX_LEVEL) {
            throw Error("Level is out of range");
        }

        if (!data.class[clas]) {
            throw Error("Unknown class ID");
        }

        let classes: { [key: string]: number } = {};
        if ("classes" in this._data) {
            classes = <{ [key: string]: number }>this._data.classes;
        }

        classes[clas] = level;

        return new CharacterBuilder({
            ...this._data,
            currentClass: clas,
            classes,
        });
    }

    withRace(race: string): CharacterBuilder<T & { race: string }> {
        if (!data.race[race]) {
            throw Error("Unknown race ID");
        }

        return new CharacterBuilder({
            ...this._data,
            race,
        });
    }
}
