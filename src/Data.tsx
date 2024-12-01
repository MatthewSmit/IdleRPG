import { createContext } from "react";
import { Data } from "./model/Data.ts";

import type { Class } from "./model/Class.ts";
import type { Race } from "./model/Race.ts";
import type { Skill } from "./model/Skill.ts";

import classData from "./assets/classes.json5";
import raceData from "./assets/races.json5";
import skillData from "./assets/skills.json5";

export const DataContext = createContext<Data>(undefined as unknown as Data);

export const data: Data = {
    class: {},
    race: {},
    skill: {},
};

interface IData {
    classes?: Class[];
    races?: Race[];
    skills?: Skill[];
}

function parseData(allData: IData) {
    if (allData.classes) {
        for (const clas of allData.classes) {
            if (data.class[clas.id]) {
                throw new Error("TODO: merging with same ID");
            }

            data.class[clas.id] = clas;
        }
    }

    if (allData.races) {
        for (const race of allData.races) {
            if (data.race[race.id]) {
                throw new Error("TODO: merging with same ID");
            }

            data.race[race.id] = race;
        }
    }

    if (allData.skills) {
        for (const skill of allData.skills) {
            if (data.skill[skill.id]) {
                throw new Error("TODO: merging with same ID");
            }

            data.skill[skill.id] = skill;
        }
    }
}

parseData(classData);
parseData(raceData);
parseData(skillData);

function validateData() {
    for (const clas of Object.values(data.class)) {
        for (let i = 0; i < clas.skills.length; i++) {
            if (!data.skill[clas.skills[i].id]) {
                console.log(
                    `UNKNOWN SKILL ID: ${clas.skills[i].id}; IN CLASS ${clas.id}.skill`
                );
                clas.skills.splice(i, 1);
            }
        }
    }
}

validateData();

console.log(data);
