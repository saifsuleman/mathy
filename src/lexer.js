const tokens = [
    [/^\s+/, null],
    [/^-?\d+(?:\.\d+)?/, 'NUMBER'],
    [/^[a-zA-Z]+/, 'IDENT'],
    [/^"[^"]+"/, 'STRING'],
    [/^\+/, '+'],
    [/^-/, '-'],
    [/^\*/, '*'],
    [/^\^/, '^'],
    [/^\//, '/'],
    [/^\(/, '('],
    [/^\)/, ')'],
    [/^,/, ','],
    [/^\=/, "="]
]

export class Lexer {
    read(string) {
        this.cursor = 0
        this.string = string
    }

    next() {
        if (this.cursor >= this.string.length) {
            return null
        }

        const str = this.string.slice(this.cursor)
        for (const [pattern, type] of tokens) {
            if (!pattern) {
                continue
            }

            const [match] = pattern.exec(str) || []
            if (!match) {
                continue
            }

            this.cursor += match.length

            if (type === null) {
                return this.next()
            }

            return { token: match, type }
        }

        throw new Error(`unrecognized input: ${str[0]}`)
    }
}