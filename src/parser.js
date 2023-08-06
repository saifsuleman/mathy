export class Parser {
    constructor(lexer) {
        this.lexer = lexer
    }

    read(string) {
        this.lexer.read(string)
        this.lookahead = this.lexer.next()
        return this.expression()
    }

    eat(...tokens) {
        const token = this.lookahead

        if (!token) {
            throw new Error(`unexpected end of input; expected ${token.type}`)
        }

        if (!tokens.includes(this.lookahead.type)) {
            throw new Error(`expected ${this.lookahead.type}`)
        }

        this.lookahead = this.lexer.next()
        return token
    }

    is(...types) {
        return types.includes(this.lookahead?.type)
    }

    expression() {
        return this.addition()
    }

    addition() {
        let left = this.call()

        while (this.is("+", "-")) {
            left = {
                type: "binary",
                left,
                op: this.eat("+", "-").type,
                right: this.call()
            }
        }

        return left
    }

    call() {
        const maybeCallee = this.multiplication()

        console.log(maybeCallee)
        if (this.is("NUMBER", "IDENT")) {
            return {
                type: "call",
                fn: maybeCallee.value,
                args: [this.call()]
            }
        }

        if (this.is("(")) {
            this.eat("(")
            const args = []

            const readExpr = () => {
                const expr = this.expression()
                if (expr) {
                    args.push(expr)
                }
            }

            readExpr()

            while (this.is(",")) {
                this.eat(",")
                readExpr()
            }

            this.eat(")")
            return { type: "call", fn: maybeCallee.value, args }
        }

        return maybeCallee
    }

    multiplication() {
        let left = this.exponentiation()

        while (this.is("*", "/")) {
            left = {
                type: "binary",
                left,
                op: this.eat("*", "/").type,
                right: this.exponentiation()
            }
        }

        return left
    }

    exponentiation() {
        let left = this.basic()

        while (this.is("^")) {
            left = {
                type: "binary",
                left,
                op: this.eat("^").type,
                right: this.basic()
            }
        }

        return left
    }

    basic() {
        if (this.is("(")) {
            this.eat("(")
            const expr = this.expression()
            this.eat(")")
            return expr
        }

        if (this.is("NUMBER")) {
            return {
                type: "number",
                value: this.eat("NUMBER").token,
            }
        }

        if (this.is("IDENT")) {
            return {
                type: "ident",
                value: this.eat("IDENT").token
            }
        }

        if (this.is("STRING")) {
            const expr = this.eat("STRING").token.slice(1, -1)
            new Parser(new Lexer()).read(expr)
            return {
                type: "expr",
                value: expr
            }
        }

        return null
    }
}