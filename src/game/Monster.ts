import type { MonsterInstanceData } from "../model/MonsterInstanceData";
import type { ICombatant } from "./CombatCalculator";

export class Monster implements ICombatant {
    private _data: MonsterInstanceData;

    constructor(data: MonsterInstanceData) {
        this._data = data;
    }

    public get id() {
        return this._data.id;
    }

    public get level() {
        return this._data.level;
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

    public get attack(): number {
        return this._data.attacks[0].attackModifier;
    }

    public get dodge(): number {
        return this._data.dodge;
    }
}
