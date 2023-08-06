import repl from "repl"
import { Compiler } from "./compiler.js"

const compiler = new Compiler()
compiler.bind("sin", Math.sin)
compiler.bind("cos", Math.cos)
compiler.bind("tan", Math.tan)
compiler.bind("rand", Math.random)

repl.start({ prompt: "mathy > ", eval: (uInput, context, filename, callback) => callback(null, compiler.compile(uInput)({})) })