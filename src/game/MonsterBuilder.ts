import { data } from "../Data";
import type { MonsterInstanceData } from "../model/MonsterInstanceData";
import { Equation } from "../scripting/Equation";
import { MonsterCombatant } from "./combat/MonsterCombatant";
import type { Game } from "./Game";

export interface IMonsterBuilderData {
    id: string;
    level?: number;
}

export function buildMonster(
    game: Game,
    builder: MonsterBuilder<IMonsterBuilderData>
): MonsterCombatant {
    const monsterData = data.monster[builder._data.id];

    const level = builder._data.level ?? monsterData.baseLevel;

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

    return new MonsterCombatant(game, instanceData);
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

    withLevel(level: number): MonsterBuilder<T & { level: number }> {
        if (level < 1) {
            throw Error("Level is out of range");
        }

        return new MonsterBuilder({
            ...this._data,
            level,
        });
    }
}
