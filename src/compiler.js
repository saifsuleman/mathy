import { Evaluator } from "./evaluator.js";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";

export class Compiler {
    constructor() {
        this.lexer = new Lexer()
        this.parser = new Parser(this.lexer)
        this.bindings = {}
        this.evaluator = new Evaluator(this.bindings)
    }

    bind(key, value) {
        this.bindings[key] = value
    }

    compile(string) {
        const ast = this.parser.read(string)
        console.log(JSON.stringify(ast))
        return (env) => this.evaluator.evaluate(ast, env)
    }
}