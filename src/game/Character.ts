import { type CharacterData, type ItemState } from "../model/CharacterData";
import { data } from "../Data.tsx";
import { HandItem, type Item, ItemSlot, Weapon } from "./Item";
import { WeaponItemData } from "../model/ItemData.ts";

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

    public get allItems() {
        const items: { slot: ItemSlot; item: Item }[] = [];

        function addItem(slot: ItemSlot, item: ItemState) {
            const itemData = data.item[item.id];
            switch (itemData.category) {
                case "weapon":
                    items.push({
                        slot,
                        item: new Weapon(<WeaponItemData>itemData),
                    });
                    break;
            }
        }

        if (this._data.inventory.leftHand) {
            addItem(ItemSlot.MAIN_HAND, this._data.inventory.leftHand);
        }

        for (const item of this._data.inventory.bag) {
            addItem(ItemSlot.BAG, item);
        }

        return items;
    }

    addItem(item: Item, tryEquip: boolean = true) {
        if (tryEquip) {
            if (item instanceof HandItem) {
                if (this._data.inventory.leftHand === undefined) {
                    this._data.inventory.leftHand = item.state;
                    return;
                }
            }
        }

        this._data.inventory.bag.push(item.state);
    }

    calculateAttackModifier(weapon: Weapon) {
        // switch (weapon.)

        // TODO skills
        return this.stats.dexterity + weapon.data.attackBonus;
    }
}
