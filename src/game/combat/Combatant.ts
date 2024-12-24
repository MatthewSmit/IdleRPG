import type { ResolveCallback } from "../../scripting/Equation";
import type { Game } from "../Game";
import { CombatCalculator } from "./CombatCalculator";

export interface IAction {
    timeRequired: number;
    timeLeft: number;

    call: () => void;
}

export abstract class Combatant {
    private _game: Game;

    protected _target?: Combatant;

    protected _action?: IAction;

    public lastActionResult: string = "";

    protected constructor(game: Game) {
        this._game = game;
    }

    public abstract get name(): string;

    public abstract get health(): number;

    public abstract get maxHealth(): number;

    public abstract get energy(): number;

    public abstract get maxEnergy(): number;

    public abstract get mana(): number;

    public abstract get maxMana(): number;

    public abstract get dodge(): number;

    public abstract get armour(): number;

    public abstract get isFriendly(): boolean;

    public get isDead(): boolean {
        return this.health <= 0;
    }

    public get currentAction(): IAction | undefined {
        return this._action;
    }

    public tick(interval: number) {
        if (this.isDead) {
            this._target = undefined;
            this._action = undefined;
            this.lastActionResult = "";
            return;
        }

        const wasNoTarget = this._target === undefined;

        // if no target or target dead, find new one and choose next action
        if (this._target === undefined || this._target.isDead) {
            this._target = this.chooseNextTarget();
            this._action = undefined;
        }

        if (this._target === undefined) {
            if (wasNoTarget) {
                this.lastActionResult = "";
            }
            return;
        }

        if (this._action === undefined) {
            this._action = this.chooseNextAction();
        } else {
            this._action.timeLeft -= interval;
        }

        if (this._action === undefined) {
            return;
        }

        if (this._action.timeLeft <= 0) {
            const extraTime = -this._action.timeLeft;

            this._action.call();
            this._action = this.chooseNextAction(extraTime);
        }
    }

    private chooseNextTarget(): Combatant | undefined {
        // TODO
        if (this.isFriendly) {
            return this._game.monsterCombatants[0];
        } else {
            return this._game.characterCombatants[0];
        }
    }

    protected abstract chooseNextAction(
        extraTime?: number
    ): IAction | undefined;

    performAttackImpl(
        target: Combatant,
        attack: { attackModifier: number; damage: ResolveCallback }
    ) {
        const combat = new CombatCalculator();
        const dodge = target.dodge;
        const hitChance = combat.hitChance(attack.attackModifier, dodge);
        if (Math.random() >= hitChance) {
            this.lastActionResult = `${target.name} dodged.`;
            return;
        }

        const baseDamage = attack.damage();
        const realDamage = combat.calculateDamage(baseDamage, target.armour);
        if (realDamage <= 0) {
            this.lastActionResult = `${target.name} took no damage.`;
            return;
        }

        this.lastActionResult = `${target.name} took ${realDamage} damage.`;
        target.damage(realDamage);
    }

    protected abstract damage(realDamage: number): void;
}
