import type { Equation, ResolveCallback } from "./Equation";

const map = new Map<string, ResolveCallback>();

export function getEquationCallback(equation: Equation): ResolveCallback {
    const text = equation.toString();
    let value = map.get(text);
    if (!value) {
        value = equation.generate();
        map.set(text, value);
    }

    return value;
}
