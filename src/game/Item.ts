import { data } from "../Data";
import type { ItemState } from "../model/CharacterData";
import type { ItemData, WeaponItemData } from "../model/ItemData";
import { Equation, type ResolveCallback } from "../scripting/Equation";
import { getEquation } from "../scripting/EquationHelper";

export enum ItemSlot {
    MAIN_HAND = "main-hand",
    BAG = "bag",
}

function isData(item: ItemData | ItemState): item is ItemData {
    return "category" in item;
}

export class Item {
    private readonly _state: ItemState;

    constructor(itemData: ItemData | ItemState) {
        if (isData(itemData)) {
            this._state = {
                id: itemData.id,
            };
        } else {
            this._state = itemData;
        }
    }

    public get data() {
        return data.item[this.state.id];
    }

    public get state(): ItemState {
        return this._state;
    }
}

export class HandItem extends Item {}

export class Weapon extends HandItem {
    readonly damage: Equation;
    readonly damageCallback: ResolveCallback;

    constructor(itemData: WeaponItemData) {
        super(itemData);

        const { equation, callback } = getEquation(itemData.damage);
        this.damage = equation;
        this.damageCallback = callback;
    }

    public get data(): WeaponItemData {
        return <WeaponItemData>data.item[this.state.id];
    }
}
