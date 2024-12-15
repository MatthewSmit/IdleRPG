import { Equation } from "../Equation";

test("Equation.Constant '0'", () => {
    const equation = new Equation("0");
    expect(equation.toString()).toBe("0");
    const value = equation.resolve();
    expect(value).toBe(0);
});

test("Equation.Constant '1d6", () => {
    const equation = new Equation("1d6");
    expect(equation.toString()).toBe("1d6");

    for (let i = 1; i <= 6; i++) {
        equation.diceRoller = () => i;
        const value = equation.resolve();
        expect(value).toBe(i);
    }
});

test("Equation.Constant '1d6 + 5", () => {
    const equation = new Equation("1d6 + 5");
    expect(equation.toString()).toBe("(1d6) + 5");
    for (let i = 1; i <= 6; i++) {
        equation.diceRoller = () => i;
        const value = equation.resolve();
        expect(value).toBe(i + 5);
    }
});

test("Equation.Constant '4 + 5", () => {
    const equation = new Equation("4 + 5");
    expect(equation.toString()).toBe("4 + 5");
    const value = equation.resolve();
    expect(value).toBe(9);
});

test("Equation.Parens '(4 + 5) * 3", () => {
    const equation = new Equation("(4 + 5) * 3");
    expect(equation.toString()).toBe("(4 + 5) * 3");
    const value = equation.resolve();
    expect(value).toBe(27);
});

test("Equation.Variable '{test}", () => {
    const equation = new Equation("{test}");
    expect(equation.toString()).toBe("{test}");
    const value = equation.resolve({
        test: 42,
    });
    expect(value).toBe(42);
});

test("Equation.VariableRoll '{test}d4", () => {
    const equation = new Equation("{test}d4");
    expect(equation.toString()).toBe("{test}d4");

    for (let i = 1; i <= 4; i++) {
        equation.diceRoller = () => i;
        const value = equation.resolve({
            test: 2,
        });
        expect(value).toBe(i * 2);
    }
});