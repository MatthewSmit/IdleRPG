import { Equation } from "../Equation";

test("Equation.Constant '1'", () => {
    const equation = new Equation("1");
    expect(equation.toString()).toBe("1");

    const value = equation.resolve();
    expect(value).toBe(1);

    const func = equation.generate();
    const funcValue = func();
    expect(funcValue).toBe(1);
});

test("Equation.Constant 1", () => {
    const equation = new Equation(1);
    expect(equation.toString()).toBe("1");

    const value = equation.resolve();
    expect(value).toBe(1);

    const func = equation.generate();
    const funcValue = func();
    expect(funcValue).toBe(1);
});

test("Equation.Constant '1d6", () => {
    const equation = new Equation("1d6");
    expect(equation.toString()).toBe("1d6");

    for (let i = 1; i <= 6; i++) {
        equation.diceRoller = () => i;
        const value = equation.resolve();
        expect(value).toBe(i);

        const func = equation.generate();
        const funcValue = func();
        expect(funcValue).toBe(i);
    }
});

test("Equation.Constant '1d6 + 5", () => {
    const equation = new Equation("1d6 + 5");
    expect(equation.toString()).toBe("(1d6) + 5");
    for (let i = 1; i <= 6; i++) {
        equation.diceRoller = () => i;
        const value = equation.resolve();
        expect(value).toBe(i + 5);

        const func = equation.generate();
        const funcValue = func();
        expect(funcValue).toBe(i + 5);
    }
});

test("Equation.Constant '4 + 5", () => {
    const equation = new Equation("4 + 5");
    expect(equation.toString()).toBe("4 + 5");
    const value = equation.resolve();
    expect(value).toBe(9);

    const func = equation.generate();
    const funcValue = func();
    expect(funcValue).toBe(9);
});

test("Equation.Parens '(4 + 5) * 3", () => {
    const equation = new Equation("(4 + 5) * 3");
    expect(equation.toString()).toBe("(4 + 5) * 3");
    const value = equation.resolve();
    expect(value).toBe(27);

    const func = equation.generate();
    const funcValue = func();
    expect(funcValue).toBe(27);
});

test("Equation.Division '7 / 2", () => {
    const equation = new Equation("7 / 2");
    expect(equation.toString()).toBe("7 / 2");
    const value = equation.resolve();
    expect(value).toBe(3);

    const func = equation.generate();
    const funcValue = func();
    expect(funcValue).toBe(3);
});

test("Equation.Subtraction '7 - 2", () => {
    const equation = new Equation("7 - 2");
    expect(equation.toString()).toBe("7 - 2");
    const value = equation.resolve();
    expect(value).toBe(5);

    const func = equation.generate();
    const funcValue = func();
    expect(funcValue).toBe(5);
});

test("Equation.Variable '{test}'", () => {
    const equation = new Equation("{test}");
    expect(equation.toString()).toBe("{test}");
    const value = equation.resolve({
        test: 42,
    });
    expect(value).toBe(42);

    const func = equation.generate();
    const funcValue = func({
        test: 42,
    });
    expect(funcValue).toBe(42);
});

test("Equation.VariableRoll '{test}d4'", () => {
    const equation = new Equation("{test}d4");
    expect(equation.toString()).toBe("{test}d4");

    for (let i = 1; i <= 4; i++) {
        equation.diceRoller = () => i;
        const value = equation.resolve({
            test: 2,
        });
        expect(value).toBe(i * 2);

        const func = equation.generate();
        const funcValue = func({
            test: 2,
        });
        expect(funcValue).toBe(i * 2);
    }
});

test("Equation.Random '1d4'", () => {
    const equation = new Equation("1d4");
    expect(equation.toString()).toBe("1d4");

    const func = equation.generate();

    for (let i = 0; i < 100; i++) {
        const value = equation.resolve();
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(4);

        const funcValue = func();
        expect(funcValue).toBeGreaterThanOrEqual(1);
        expect(funcValue).toBeLessThanOrEqual(4);
    }
});

test("Equation.DynamicVariable '{test}'", () => {
    const equation = new Equation("{test}");
    expect(equation.toString()).toBe("{test}");

    const value = equation.resolve({
        get: (_) => 42,
        exists: (variable) => variable === "test",
    });
    expect(value).toBe(42);

    const func = equation.generate();
    const funcValue = func({
        get: (_) => 42,
        exists: (variable) => variable === "test",
    });
    expect(funcValue).toBe(42);
});

test("Equation.MissingVariable '{missing}'", () => {
    const equation = new Equation("{missing}");

    expect(() => equation.resolve()).toThrow();
    expect(() => equation.resolve({})).toThrow();
    expect(() =>
        equation.resolve({ get: (_) => 0, exists: (_) => false })
    ).toThrow();

    const func = equation.generate();
    expect(() => func()).toThrow();
    expect(() => func({})).toThrow();
    expect(() => func({ get: (_) => 0, exists: (_) => false })).toThrow();
});
