import { Suite } from "bench-node";
import * as peggy from "peggy";
import * as fs from "node:fs";

const code = peggy.default.generate(
    fs.readFileSync("./src/scripting/equationParser.pegjs", "utf8"),
    {
        output: "parser",
        format: "commonjs",
    }
);

const parse = code.parse;

function StandardDiceRoller(min, max) {
    const size = max - min + 1;
    return Math.floor(size * Math.random()) + min;
}

function isStore(variables) {
    return "get" in variables && "exists" in variables;
}

function getVariableStore(variables) {
    if (variables === undefined) {
        return {
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

class Equation {
    diceRoller = StandardDiceRoller;

    constructor(diceRoll) {
        if (typeof diceRoll === "number") {
            this.value = diceRoll;
        } else {
            this.value = parse(diceRoll);
        }
    }

    toString() {
        function impl(value) {
            function handleParens(childValue) {
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
                        case "ADD":
                            return `${left} + ${right}`;

                        case "SUB":
                            return `${left} - ${right}`;

                        case "MULT":
                            return `${left} * ${right}`;

                        case "DIV":
                            return `${left} / ${right}`;

                        case "ROLL":
                            return `${left}d${right}`;
                    }
                }
            }
        }

        return impl(this.value);
    }

    resolve(variables = {}) {
        const variableStore = getVariableStore(variables);

        const impl = (value) => {
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
                        case "ADD":
                            return (left + right) | 0;

                        case "SUB":
                            return (left - right) | 0;

                        case "MULT":
                            return (left * right) | 0;

                        case "DIV":
                            return (left / right) | 0;

                        case "ROLL": {
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

    generate() {
        const variables = new Set();

        function impl(value) {
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
                        case "ADD":
                            return `((${left} + ${right}) | 0)`;

                        case "SUB":
                            return `((${left} - ${right}) | 0)`;

                        case "MULT":
                            return `((${left} * ${right}) | 0)`;

                        case "DIV":
                            return `((${left} / ${right}) | 0)`;

                        case "ROLL":
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

const suite = new Suite({
    repeatSuite: 5,
});

const equation1 = new Equation("(1 + 4) * 8 / 2");
const equation2 = new Equation("100d123");
equation2.diceRoller = () => 1;
const equation3 = new Equation("{test}d4 + 112");
equation3.diceRoller = () => 1;
const equation1Func = equation1.generate();
const equation2Func = equation2.generate();
const equation3Func = equation3.generate();

suite.add("Interpreted1", () => {
    equation1.resolve();
});

suite.add("Interpreted2", () => {
    equation2.resolve();
});

suite.add("Interpreted3", () => {
    equation3.resolve({ test: 40 });
});

suite.add("Compiled1", () => {
    equation1Func();
});

suite.add("Compiled2", () => {
    equation2Func();
});

suite.add("Compiled3", () => {
    equation3Func({ test: 40 });
});

await suite.run();
