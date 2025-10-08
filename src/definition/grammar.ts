import { Parser } from "../core/parser.js";
import { ref0 } from "./reference.js";
import { resolve } from "./resolve.js";

export { GrammarDefinition };

abstract class GrammarDefinition<T> {
    constructor() {}

    abstract start(): Parser<T>;

    build(): Parser<T> {
        return this.buildFrom(ref0(this.start));
    }

    buildFrom<U>(parser: Parser<U>) {
        return resolve(parser);
    }
}