import { CharacterData } from "../model/CharacterData.ts";
import { data } from "../Data.tsx";

export class Character {
    _data: CharacterData;

    public constructor() {
        this._data = {
            name: "Test",
            currentClass: "fighter",
            classes: { fighter: { level: 1, xp: 0 } },
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
        };
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

    public get level() {
        return this.classData.level;
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

    public get stats() {
        return {
            ...this._data.stats,
        };
    }
}
