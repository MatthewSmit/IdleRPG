import { createContext } from "react";
import { Data } from "./model/Data";

import type { ClassData } from "./model/ClassData";
import type { DungeonData } from "./model/DungeonData";
import type { ItemData } from "./model/ItemData";
import type { MonsterData } from "./model/MonsterData";
import type { RaceData } from "./model/RaceData";
import type { SkillData } from "./model/SkillData";
import type { StartConditions } from "./model/StartConditions";

export const DataContext = createContext<Data>(undefined as unknown as Data);

export const data: Data = {
    class: {},
    dungeons: {},
    item: {},
    monster: {},
    race: {},
    skill: {},
    start: [],
};

interface IData {
    classes?: ClassData[];
    dungeons?: DungeonData[];
    items?: ItemData[];
    monsters?: MonsterData[];
    races?: RaceData[];
    skills?: SkillData[];
    start?: StartConditions[];
}

function parseData(allData: IData) {
    function addStandard<T extends { id: string }>(
        outputData: { [key: string]: T },
        inputData?: T[]
    ) {
        if (inputData) {
            for (const datum of inputData) {
                if (outputData[datum.id]) {
                    throw new Error("TODO: merging with same ID");
                }

                outputData[datum.id] = datum;
            }
        }
    }

    addStandard(data.class, allData.classes);
    addStandard(data.dungeons, allData.dungeons);
    addStandard(data.item, allData.items);
    addStandard(data.monster, allData.monsters);
    addStandard(data.race, allData.races);
    addStandard(data.skill, allData.skills);

    if (allData.start) {
        for (const startCondition of allData.start) {
            data.start.push(startCondition);
        }
    }
}

const allData = import.meta.glob("./assets/*.json5");
for (const data of Object.values(allData)) {
    parseData((await data()) as IData);
}

function validateClass(clas: ClassData) {
    for (let i = 0; i < clas.skills.length; i++) {
        if (!data.skill[clas.skills[i].id]) {
            console.log(
                `UNKNOWN SKILL ID: '${clas.skills[i].id}' IN CLASS '${clas.id}.skill'`
            );
            clas.skills.splice(i--, 1);
        }
    }
}

function validateDungeon(dungeon: DungeonData) {
    for (let i = 0; i < dungeon.monsters.length; i++) {
        if (!data.monster[dungeon.monsters[i]]) {
            console.log(
                `UNKNOWN MONSTER ID: '${dungeon.monsters[i]}' IN MONSTER '${dungeon.id}.monsters'`
            );
            dungeon.monsters.splice(i--, 1);
        }
    }
}

function validateStart() {
    const validStart: { race: string; class: string }[] = [];
    for (const race of Object.values(data.race)) {
        for (const clas of Object.values(data.class)) {
            // TODO: Only base class

            validStart.push({
                race: race.id,
                class: clas.id,
            });
        }
    }

    for (const startCondition of data.start) {
        const found = validStart.filter(
            (x) =>
                x.class === startCondition.class &&
                x.race === startCondition.race
        )[0];

        if (found) {
            const index = validStart.indexOf(found);
            validStart.splice(index, 1);
        } else {
            console.log(
                `START FOR ${startCondition.race}/${startCondition.class} DOES NOT REFER TO A VALID CONDITION`
            );
        }

        for (const skill of startCondition.skills) {
            if (!data.skill[skill]) {
                console.log(
                    `START FOR ${startCondition.race}/${startCondition.class} REFERS TO AN INVALID SKILL ${skill}`
                );
            }
        }

        for (const item of startCondition.items) {
            if (!data.item[item]) {
                console.log(
                    `START FOR ${startCondition.race}/${startCondition.class} REFERS TO AN INVALID ITEM ${item}`
                );
            }
        }
    }

    if (validStart.length > 0) {
        for (const validStartElement of validStart) {
            console.log(
                `NO VALID START FOR ${validStartElement.race}/${
                    validStartElement.class
                }`
            );
            data.start.push({
                race: validStartElement.race,
                class: validStartElement.class,
                skills: ["unarmed"],
                items: [],
            });
        }
    }
}

function validateData() {
    for (const clas of Object.values(data.class)) {
        validateClass(clas);
    }

    for (const dungeon of Object.values(data.dungeons)) {
        validateDungeon(dungeon);
    }

    validateStart();
}

validateData();

console.log(data);
