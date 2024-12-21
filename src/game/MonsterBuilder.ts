import { data } from "../Data";
import type { MonsterInstanceData } from "../model/MonsterInstanceData";
import { Equation } from "../scripting/Equation";
import { Monster } from "./Monster";

interface IMonsterBuilderData {
    id: string;
}

export function buildMonster(
    builder: MonsterBuilder<IMonsterBuilderData>
): Monster {
    const monsterData = data.monster[builder._data.id];

    const level = monsterData.baseLevel;

    const vars = {
        level,
    };

    const health = new Equation(monsterData.health).resolve(vars);
    const energy = new Equation(monsterData.energy).resolve(vars);
    const mana = new Equation(monsterData.mana).resolve(vars);

    const instanceData: MonsterInstanceData = {
        id: monsterData.id,
        level,
        health,
        energy,
        mana,
        maxHealth: health,
        maxEnergy: energy,
        maxMana: mana,
        attacks: monsterData.attacks,
        dodge: monsterData.dodge,
        armour: monsterData.armour ?? 0,
    };

    return new Monster(instanceData);
}

export class MonsterBuilder<T extends object> {
    readonly _data: T;

    constructor(data: T) {
        this._data = data;
    }

    static new(id: string): MonsterBuilder<object & { id: string }> {
        if (!data.monster[id]) {
            throw Error("Unknown monster ID");
        }

        return new MonsterBuilder({ id });
    }
}