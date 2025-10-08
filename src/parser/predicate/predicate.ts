import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import { Parser } from "../../core/parser.js";
import type { Result } from "../../core/result.js";
import type { Predicate } from "../../shared/types.js";

export { PredicateParser, predicate };

const predicate = (length: int, predicate: Predicate<string>, message: string): Parser<string> => {
    return new PredicateParser(length, predicate, message);
}

class PredicateParser extends Parser<string> {
    readonly length: int;
    readonly predicate: Predicate<string>;
    readonly message: string;

    constructor(length: int | number, predicate: Predicate<string>, message: string) {
        super();
        this.length = length as int;
        this.predicate = predicate;
        this.message = message;
    }

    override parseOn(context: Context): Result<string> {
        const start = context.position;
        const stop = start + this.length;
        if (stop <= context.buffer.length) {
            const result = context.buffer.substring(start, stop);
            if (this.predicate(result)) {
                return context.success(result, stop as int); 
            }
        }
        return context.failure(this.message);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        const stop = position + this.length;
        return (stop <= buffer.length && this.predicate(buffer.substring(position, stop)) ?
            stop :
            -1) as int;
    }

    override copy(): PredicateParser {
        return new PredicateParser(this.length, this.predicate, this.message);
    }

    override hasEqualProperties(other: PredicateParser): boolean {
        return super.hasEqualProperties(other) && this.length === other.length && this.predicate === other.predicate && this.message === other.message;
    }
}