import i18n from "../../internationalisation";
import type {
    MonsterAttackData,
    MonsterInstanceData,
} from "../../model/MonsterInstanceData";
import { getEquation } from "../../scripting/EquationHelper";
import { ROUND_TIME, TICK_INTERVAL } from "../Constants";
import type { Game } from "../Game";
import { ActionType, Combatant, IAction } from "./Combatant";

export class MonsterCombatant extends Combatant {
    private _data: MonsterInstanceData;

    constructor(game: Game, data: MonsterInstanceData) {
        super(game);
        this._data = data;
    }

    public override get id(): string {
        return this._data.id;
    }

    public override get name(): string {
        return i18n.t(this.id, { ns: "monster" });
    }

    public get level() {
        return this._data.level;
    }

    public override get health() {
        return this._data.health;
    }

    public override get maxHealth() {
        return this._data.maxHealth;
    }

    public override get energy() {
        return this._data.energy;
    }

    public override get maxEnergy() {
        return this._data.maxEnergy;
    }

    public override get mana() {
        return this._data.mana;
    }

    public override get maxMana() {
        return this._data.maxMana;
    }

    public override get dodge(): number {
        return this._data.dodge;
    }

    public override get armour(): number {
        return this._data.armour;
    }

    public override get isFriendly(): boolean {
        return false;
    }

    protected override chooseNextAction(
        extraTime: number = 0
    ): IAction | undefined {
        const target = this.chooseNextTarget();
        if (!target) {
            return undefined;
        }

        // TODO
        const attack = this._data.attacks[0];
        const timeRequired = ROUND_TIME / attack.attackSpeed;
        return {
            target,
            actionType: ActionType.MAIN_ATTACK,
            timeRequired,
            timeLeft: Math.max(timeRequired - extraTime, TICK_INTERVAL),
            call: () => {
                if (target) {
                    this.performAttack(target, attack);
                }
            },
        };
    }

    private performAttack(target: Combatant, attack: MonsterAttackData) {
        super.performAttackImpl(target, {
            attackModifier: attack.attackModifier,
            damage: getEquation(attack.damage).callback,
        });
    }

    protected override damage(realDamage: number) {
        this._data.health -= realDamage;
    }
}
