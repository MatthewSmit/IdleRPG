export interface ICombatant {
    attack: number;
    dodge: number;
}

export class CombatCalculator {
    hitChance(attacker: ICombatant, defender: ICombatant) {
        const attack = attacker.attack;
        const dodge = defender.dodge;

        if (attack < dodge) {
            return -0.5 * (-1 / (dodge / attack));
        } else {
            return 0.5 * (-1 / (attack / dodge)) + 1;
        }
    }
}
