import { createContext } from "react";

import type { Character } from "./Character";
import { CharacterCombatant } from "./combat/CharacterCombatant";
import type { Combatant } from "./combat/Combatant";
import type { MonsterCombatant } from "./combat/MonsterCombatant";
import {
    buildMonster,
    type IMonsterBuilderData,
    type MonsterBuilder,
} from "./MonsterBuilder";

export class Game {
    characters: Character[] = [];

    characterCombatants: CharacterCombatant[] = [];
    monsterCombatants: MonsterCombatant[] = [];
    interval: number = 0;

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
    }
}

export const GameContext = createContext<Game | null>(null);
