import { CharacterData } from "../model/CharacterData";
import { data } from "../Data.tsx";

export class Character {
    _data: CharacterData;

    public constructor() {
        this._data = {
            name: "Test",
            currentClass: "fighter",
            classes: { fighter: { level: 1, xp: 0 } },
            race: "human",
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
        };

        const start = data.start.filter(
            (x) => x.race === "human" && x.class === "fighter"
        )[0];
        for (const skill of start.skills) {
            this._data.skills[skill] = {
                level: 1,
                rank: 1,
            };
        }
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
