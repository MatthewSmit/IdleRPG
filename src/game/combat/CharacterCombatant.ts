import { data } from "../../Data";
import type { ItemState } from "../../model/CharacterData";
import type { WeaponItemData } from "../../model/ItemData";
import type { Character } from "../Character";
import { ROUND_TIME, TICK_INTERVAL } from "../Constants";
import type { Game } from "../Game";
import { Weapon } from "../Item";
import { ActionType, Combatant, IAction } from "./Combatant";

function ensureWeapon(item: ItemState | undefined): WeaponItemData {
    if (item === undefined) {
        throw new Error("Invalid state: character has no weapon");
    }

    const itemData = data.item[item.id];
    if (itemData.category !== "weapon") {
        throw new Error("Invalid state: characters weapon isn't a weapon");
    }

    return <WeaponItemData>itemData;
}

export class CharacterCombatant extends Combatant {
    private _character: Character;
    private _health: number;
    private _energy: number;
    private _mana: number;
    private _mainWeapon: Weapon;

    public constructor(game: Game, character: Character) {
        super(game);
        this._character = character;
        this._health = character.maxHealth;
        this._energy = character.maxEnergy;
        this._mana = character.maxMana;
        this._mainWeapon = new Weapon(
            ensureWeapon(character._data.inventory.leftHand)
        );
    }

    public override get id(): string {
        // TODO:
        return "character";
    }

    public override get name(): string {
        return this._character.name;
    }

    public override get health(): number {
        return this._health;
    }

    public override get maxHealth(): number {
        return this._character.maxHealth;
    }

    public override get energy(): number {
        return this._energy;
    }

    public override get maxEnergy(): number {
        return this._character.maxEnergy;
    }

    public override get mana(): number {
        return this._mana;
    }

    public override get maxMana(): number {
        return this._character.maxMana;
    }

    public override get dodge(): number {
        return this._character.dodge;
    }

    public override get armour(): number {
        // TODO
        return 0;
    }

    public override get isFriendly(): boolean {
        return true;
    }

    protected override chooseNextAction(
        extraTime: number = 0
    ): IAction | undefined {
        const target = this.chooseNextTarget();
        if (!target) {
            return undefined;
        }

        // TODO
        const timeRequired = ROUND_TIME;
        return {
            target,
            actionType: ActionType.MAIN_ATTACK,
            timeRequired,
            timeLeft: Math.max(timeRequired - extraTime, TICK_INTERVAL),
            call: () => {
                if (target) {
                    this.performAttack(target, this._mainWeapon);
                }
            },
        };
    }

    private performAttack(target: Combatant, mainWeapon: Weapon) {
        super.performAttackImpl(target, {
            attackModifier: this._character.calculateAttackModifier(mainWeapon),
            damage: mainWeapon.damageCallback,
        });
    }

    protected override damage(realDamage: number) {
        this._health -= realDamage;
    }
}
