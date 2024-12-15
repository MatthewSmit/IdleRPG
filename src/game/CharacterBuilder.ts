import { MAX_LEVEL } from "../constants";
import { data } from "../Data";
import type { CharacterClassData, CharacterData } from "../model/CharacterData";
import { Character } from "./Character";
import { createItem } from "./ItemBuilder";

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
        inventory: { bag: [] },
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

    const character = new Character(characterData);

    for (const item of start.items) {
        character.addItem(createItem(item));
    }

    return character;
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
