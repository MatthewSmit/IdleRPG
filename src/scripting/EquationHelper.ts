import { DiceRollData } from "../model/DiceRollData";
import { Equation, ResolveCallback } from "./Equation";

const callbackMap = new Map<string, ResolveCallback>();
const equationMap = new Map<
    DiceRollData,
    {
        equation: Equation;
        callback: ResolveCallback;
    }
>();

export function getEquation(text: DiceRollData): {
    equation: Equation;
    callback: ResolveCallback;
} {
    let value = equationMap.get(text);
    if (!value) {
        const equation = new Equation(text);
        value = {
            equation,
            callback: getEquationCallback(equation),
        };
    }

    return value;
}

export function getEquationCallback(equation: Equation): ResolveCallback {
    const text = equation.toString();
    let value = callbackMap.get(text);
    if (!value) {
        value = equation.generate();
        callbackMap.set(text, value);
    }

    return value;
}
