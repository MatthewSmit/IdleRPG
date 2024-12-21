import { CombatCalculator } from "../CombatCalculator";

test("Hit chance - Equal", () => {
    const calculator = new CombatCalculator();

    const result = calculator.hitChance(
        {
            attack: 10,
            dodge: 10,
        },
        {
            attack: 10,
            dodge: 10,
        }
    );

    expect(result).toBeCloseTo(0.5, 3);
});

test("Hit chance - Higher attack", () => {
    const calculator = new CombatCalculator();

    const result = calculator.hitChance(
        {
            attack: 20,
            dodge: 20,
        },
        {
            attack: 10,
            dodge: 10,
        }
    );

    expect(result).toBeCloseTo(0.75, 3);
});

test("Hit chance - Higher defence", () => {
    const calculator = new CombatCalculator();

    const result = calculator.hitChance(
        {
            attack: 10,
            dodge: 10,
        },
        {
            attack: 20,
            dodge: 20,
        }
    );

    expect(result).toBeCloseTo(0.25, 3);
});
