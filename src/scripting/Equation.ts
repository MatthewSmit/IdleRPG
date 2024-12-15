import { parse } from "./equationParser.pegjs";

enum OperationType {
    ADD = "ADD",
    SUB = "SUB",
    MULT = "MULT",
    DIV = "DIV",
    ROLL = "ROLL",
}

interface Operation {
    type: OperationType;
    left: Datum;
    right: Datum;
}

type Datum = Operation | number | string;

type DiceRoller = (min: number, max: number) => number;

function StandardDiceRoller(min: number, max: number) {
    const size = max - min + 1;
    return Math.floor(size * Math.random()) + min;
}

export class Equation {
    private readonly value: Datum;

    diceRoller: DiceRoller = StandardDiceRoller;

    constructor(diceRoll: string | number) {
        if (typeof diceRoll === "number") {
            this.value = diceRoll;
        } else {
            this.value = parse(diceRoll);
        }
    }

    static toStringImpl(value: Datum): string {
        function handleParens(childValue: Datum) {
            if (typeof childValue == "object") {
                return `(${Equation.toStringImpl(childValue)})`;
            }

            return Equation.toStringImpl(childValue);
        }

        switch (typeof value) {
            case "string":
                return `{${value}}`;

            case "number":
                return value.toString();

            case "object": {
                const left = handleParens(value.left);
                const right = handleParens(value.right);

                switch (value.type) {
                    case OperationType.ADD:
                        return `${left} + ${right}`;

                    case OperationType.SUB:
                        return `${left} - ${right}`;

                    case OperationType.MULT:
                        return `${left} * ${right}`;

                    case OperationType.DIV:
                        return `${left} / ${right}`;

                    case OperationType.ROLL:
                        return `${left}d${right}`;
                }
            }
        }
    }

    toString(): string {
        return Equation.toStringImpl(this.value);
    }

    resolveImpl(value: Datum, variables: { [key: string]: number }): number {
        switch (typeof value) {
            case "string":
                if (value in variables) {
                    return variables[value];
                }

                throw new Error(`Unknown variable: ${value}`);

            case "number":
                return value;

            case "object": {
                const left = this.resolveImpl(value.left, variables);
                const right = this.resolveImpl(value.right, variables);

                switch (value.type) {
                    case OperationType.ADD:
                        return Math.round(left + right);

                    case OperationType.SUB:
                        return Math.round(right - right);

                    case OperationType.MULT:
                        return Math.round(left * right);

                    case OperationType.DIV:
                        return Math.round(left / right);

                    case OperationType.ROLL: {
                        let sum = 0;
                        for (let i = 0; i < left; i++) {
                            sum += this.diceRoller(1, right);
                        }
                        return sum;
                    }
                }
            }
        }
    }

    resolve(variables: { [key: string]: number } = {}): number {
        return this.resolveImpl(this.value, variables);
    }
}
