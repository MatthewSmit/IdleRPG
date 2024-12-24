import { createContext } from "react";
import { data } from "../Data";
import type { DungeonData } from "../model/DungeonData";

import type { Character } from "./Character";
import { CharacterCombatant } from "./combat/CharacterCombatant";
import type { Combatant } from "./combat/Combatant";
import type { MonsterCombatant } from "./combat/MonsterCombatant";
import {
    buildMonster,
    MonsterBuilder,
    type IMonsterBuilderData,
} from "./MonsterBuilder";

export class Game {
    characters: Character[] = [];

    characterCombatants: CharacterCombatant[] = [];
    monsterCombatants: MonsterCombatant[] = [];
    interval: number = 0;

    currentDungeon: DungeonData;

    public constructor() {
        this.currentDungeon = Object.values(data.dungeons)[0];
    }

    public addCharacter(character: Character) {
        this.characters.push(character);
    }

    public addCharacterCombatant(character: Character) {
        this.characterCombatants.push(new CharacterCombatant(this, character));
    }

    public addMonster(monster: MonsterBuilder<IMonsterBuilderData>) {
        this.monsterCombatants.push(buildMonster(this, monster));
    }

    tick(interval: number) {
        this.interval = interval;
        // TODO: need to order them & take initiative into account

        const combatants: Combatant[] = [
            ...this.characterCombatants,
            ...this.monsterCombatants,
        ];

        for (const combatant of combatants) {
            combatant.tick(interval);
        }

        if (
            this.characterCombatants.filter((combatant) => combatant.isDead)
                .length === this.characterCombatants.length
        ) {
            // TODO: do something
        }

        if (
            this.monsterCombatants.filter((combatant) => combatant.isDead)
                .length === this.monsterCombatants.length
        ) {
            this.monsterCombatants = [];
        }

        if (this.monsterCombatants.length === 0) {
            this.generateMonsters();
        }
    }

    private generateMonsters() {
        // TODO: random amount
        const amount = 1;
        for (let i = 0; i < amount; i++) {
            // TODO: randomise
            const monster = this.currentDungeon.monsters[0];
            // TODO: randomise
            const level = this.currentDungeon.minLevel;

            this.addMonster(MonsterBuilder.new(monster).withLevel(level));
        }
    }
}

export const GameContext = createContext<Game | null>(null);
