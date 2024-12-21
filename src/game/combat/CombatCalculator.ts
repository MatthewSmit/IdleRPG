export class CombatCalculator {
    hitChance(attack: number, dodge: number) {
        const modifiedAttack = Math.max(attack, 1);
        const modifiedDodge = Math.max(dodge, 1);

        if (attack < dodge) {
            return -0.5 * (-1 / (modifiedDodge / modifiedAttack));
        } else {
            return 0.5 * (-1 / (modifiedAttack / modifiedDodge)) + 1;
        }
    }

    calculateDamage(baseDamage: number, armour: number) {
        return Math.max(baseDamage - armour, 0);
    }
}
