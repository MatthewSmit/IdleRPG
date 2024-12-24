import type { ResolveCallback } from "../../scripting/Equation";
import { ACTION_RESULT_TIME, TICK_MULTIPLIER } from "../Constants";
import type { Game } from "../Game";
import { CombatCalculator } from "./CombatCalculator";

export enum ActionType {
    MAIN_ATTACK,
}

export interface IAction {
    target: Combatant;

    actionType: ActionType;

    timeRequired: number;
    timeLeft: number;

    call: () => void;
}

export abstract class Combatant {
    private _game: Game;

    protected _actions: IAction[] = [];

    private _actionResults: {
        text: string;
        timeLeft: number;
    }[] = [];

    protected constructor(game: Game) {
        this._game = game;
    }

    public abstract get id(): string;

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

    public get actionResults() {
        return this._actionResults;
    }

    public get currentActions(): IAction[] {
        return this._actions;
    }

    public tick(interval: number) {
        for (const actionResult of this._actionResults) {
            actionResult.timeLeft -= interval / TICK_MULTIPLIER;
        }

        this._actionResults = this._actionResults.filter(
            (actionResult) => actionResult.timeLeft > 0
        );

        if (this.isDead) {
            this._actions = [];
            return;
        }

        let extraTime = 0;

        for (const action of this._actions) {
            action.timeLeft -= interval;

            // TODO: allow some actions that target dead things
            if (action.target.isDead) {
                action.timeLeft = 0;
            } else if (action.timeLeft <= 0) {
                action.call();
                extraTime = -action.timeLeft;
            }
        }

        this._actions = this._actions.filter((action) => action.timeLeft > 0);

        this.tryAddNewActions(extraTime);
    }

    protected chooseNextTarget(): Combatant | undefined {
        let validTargets: Combatant[] = this.isFriendly
            ? this._game.monsterCombatants
            : this._game.characterCombatants;

        validTargets = validTargets.filter((target) => !target.isDead);
        // TODO
        return validTargets[0];
    }

    private tryAddNewActions(extraTime: number) {
        // TODO: handle multiple actions at the same time
        const hasMainAction =
            this._actions.filter(
                (action) => action.actionType === ActionType.MAIN_ATTACK
            ).length > 0;

        if (!hasMainAction) {
            const nextAction = this.chooseNextAction(extraTime);
            if (nextAction) {
                this._actions.push(nextAction);
            }
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
            this._actionResults.push({
                text: `${target.name} dodged`,
                timeLeft: ACTION_RESULT_TIME,
            });
            return;
        }

        const baseDamage = attack.damage();
        const realDamage = combat.calculateDamage(baseDamage, target.armour);
        if (realDamage <= 0) {
            this._actionResults.push({
                text: `${target.name} took no damage`,
                timeLeft: ACTION_RESULT_TIME,
            });
            return;
        }

        this._actionResults.push({
            text: `${target.name} took ${realDamage} damage`,
            timeLeft: ACTION_RESULT_TIME,
        });
        target.damage(realDamage);
    }

    protected abstract damage(realDamage: number): void;
}
