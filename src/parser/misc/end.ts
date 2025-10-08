import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import { Parser } from "../../core/parser.js";
import type { Result } from "../../core/result.js";

export { EndOfInputParser, endOfInput }

const endOfInput = (message: string = "end of input expected"): EndOfInputParser => {
    return new EndOfInputParser(message);
}

class EndOfInputParser extends Parser<null> {
    readonly message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    override parseOn(context: Context): Result<null> {
        return context.position < context.buffer.length ?
            context.failure(this.message) :
            context.success(null);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        return (position < buffer.length ? -1 : position) as int;
    }

    override copy(): EndOfInputParser {
        return new EndOfInputParser(this.message);
    }

    override hasEqualProperties(other: EndOfInputParser): boolean {
        return super.hasEqualProperties(other) && this.message === other.message;
    }

    override toString(): string {
        return `${super.toString()}[${this.message}]`;
    }
}