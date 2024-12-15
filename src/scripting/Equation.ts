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

export interface IVariableStore {
    get: (variable: string) => number;

    exists: (variable: string) => boolean;
}

function isStore(
    variables: IVariableStore | { [key: string]: number }
): variables is IVariableStore {
    return "get" in variables && "exists" in variables;
}

function getVariableStore(
    variables?:
        | IVariableStore
        | {
              [key: string]: number;
          }
): IVariableStore {
    if (variables === undefined) {
        return {
            /* istanbul ignore next */
            get: (_) => 0,
            exists: (_) => false,
        };
    }

    if (isStore(variables)) {
        return variables;
    }

    return {
        get: (variable) => {
            return variables[variable] || 0;
        },
        exists: (variable) => {
            return variable in variables;
        },
    };
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

    toString(): string {
        function impl(value: Datum): string {
            function handleParens(childValue: Datum) {
                if (typeof childValue == "object") {
                    return `(${impl(childValue)})`;
                }

                return impl(childValue);
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

        return impl(this.value);
    }

    resolve(
        variables: IVariableStore | { [key: string]: number } = {}
    ): number {
        const variableStore = getVariableStore(variables);

        const impl = (value: Datum): number => {
            switch (typeof value) {
                case "string":
                    if (variableStore.exists(value)) {
                        return variableStore.get(value);
                    }

                    throw new Error(`Unknown variable: ${value}`);

                case "number":
                    return value | 0;

                case "object": {
                    const left = impl(value.left) | 0;
                    const right = impl(value.right) | 0;

                    switch (value.type) {
                        case OperationType.ADD:
                            return (left + right) | 0;

                        case OperationType.SUB:
                            return (left - right) | 0;

                        case OperationType.MULT:
                            return (left * right) | 0;

                        case OperationType.DIV:
                            return (left / right) | 0;

                        case OperationType.ROLL: {
                            let sum = 0;
                            for (let i = 0; i < left; i++) {
                                sum += this.diceRoller(1, right);
                            }
                            return sum | 0;
                        }
                    }
                }
            }
        };

        return impl(this.value);
    }

    generate(): (
        variables?: IVariableStore | { [key: string]: number }
    ) => number {
        const variables = new Set<string>();

        function impl(value: Datum): string {
            switch (typeof value) {
                case "number":
                    return (value || 0).toString();

                case "string":
                    variables.add(value);
                    return `variables.get('${value}')`;

                case "object": {
                    const left = impl(value.left);
                    const right = impl(value.right);
                    switch (value.type) {
                        case OperationType.ADD:
                            return `((${left} + ${right}) | 0)`;

                        case OperationType.SUB:
                            return `((${left} - ${right}) | 0)`;

                        case OperationType.MULT:
                            return `((${left} * ${right}) | 0)`;

                        case OperationType.DIV:
                            return `((${left} / ${right}) | 0)`;

                        case OperationType.ROLL:
                            return `roll(${left}, ${right})`;
                    }
                }
            }
        }

        const valueText = impl(this.value);

        const functionName = this.toString();
        let functionText = `return {['${functionName}']: function(variables){\n`;
        if (variables.size > 0) {
            functionText += `variables=getVariableStore(variables);\n`;
        }
        functionText += `function roll(times,size){let result=0;for(let i=0;i<times;i++)result+=diceRoller(1,size);return result;}\n`;

        for (const variable of variables) {
            functionText += `if (!variables.exists('${variable}')) throw new Error('Unknown variable: ${variable}');\n`;
        }

        functionText += `return ${valueText};\n}}['${functionName}']`;

        return new Function("diceRoller", "getVariableStore", functionText)(
            this.diceRoller,
            getVariableStore
        );
    }
}
