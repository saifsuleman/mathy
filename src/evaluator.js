export class Evaluator {
    constructor(fields) {
        this.fields = fields
    }

    binaryEval(op, left, right) {
        switch (op) {
            case "+":
                return left + right
            case "-":
                return left - right
            case "*":
                return left * right
            case "/":
                return left / right
            case "^":
                return left ** right
        }

        throw "invalid op: " + op
    }

    lookup(ident, fields) {
        if (ident in fields) {
            return fields[ident]
        }   

        if (ident in this.fields) {
            return this.fields[ident]
        }   

        throw "unexpected identifier: " + ident
    }

    evaluate(node, env) {
        switch (node.type) {
            case "binary":
                const left = this.evaluate(node.left, env)
                const right = this.evaluate(node.right, env)
                return this.binaryEval(node.op, left, right)
            case "call":
                const fn = this.lookup(node.fn, env)
                const args = node.args.map(arg => this.evaluate(arg, env))
                return fn.apply(null, args)
            case "ident":
                return this.lookup(node.value, env)
            case "number":
                return +node.value
            case "expr":
                return this.compile(node.value)
        }
    }
}