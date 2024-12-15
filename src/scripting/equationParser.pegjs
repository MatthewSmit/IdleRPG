Expression
	= head:Addition { return head; };

Addition
	= head:Multiplication tail:(_ ("+" / "-") _ Multiplication)* {
    	let result = head;

        for (let i = 0; i < tail.length; i++) {
        	result = {
            	type: tail[i][1] === "+" ? "ADD" : "SUB",
                left: result,
                right: tail[i][3],
            };
        }

        return result;
    };

Multiplication
	= head:DiceRoll tail:(_ ("*" / "/") _ DiceRoll)* {
    	let result = head;

        for (let i = 0; i < tail.length; i++) {
        	result = {
            	type: tail[i][1] === "*" ? "MULT" : "DIV",
                left: result,
                right: tail[i][3],
            };
        }

        return result;
    };

DiceRoll
	= head:Datum tail:("d" Datum)? {
    	if (tail) {
        	return {
            	type: "ROLL",
                left: head,
                right: tail[1],
            };
        }

    	return head;
    };

Datum
	= "(" expr:Expression ")" { return expr; }
    / expr:Integer
    / Variable;

Integer "integer"
	= _ [0-9]+ { return parseInt(text(), 10) };

Variable "variable"
	= "{" variable:([a-zA-Z0-9_:]+) "}" { return variable.join(""); };

_ "whitespace"
	= [ \t\n\r]*;
