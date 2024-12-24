import { expect, test } from "vitest";

import { CombatCalculator } from "../CombatCalculator";
 
test("Hit chance - Equal", () => {
    const calculator = new CombatCalculator();

    const result = calculator.hitChance(10, 10);

    expect(result).toBeCloseTo(0.5, 3);
});

test("Hit chance - Higher attack", () => {
    const calculator = new CombatCalculator();

    const result = calculator.hitChance(20, 10);

    expect(result).toBeCloseTo(0.75, 3);
});

test("Hit chance - Higher defence", () => {
    const calculator = new CombatCalculator();

    const result = calculator.hitChance(10, 20);

    expect(result).toBeCloseTo(0.25, 3);
});
