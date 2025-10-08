import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import { Parser } from "../../core/parser.js";
import type { Result } from "../../core/result.js";

export { EpsilonParser, epsilon, epsilonWith };

const epsilon = (): EpsilonParser<null> => {
    return epsilonWith(null);
}

const epsilonWith = <T>(result: T): EpsilonParser<T> => {
    return new EpsilonParser(result);
}

class EpsilonParser<T> extends Parser<T> {
    readonly result: T;

    constructor(result: T) {
        super();
        this.result = result;
    }

    override parseOn(context: Context): Result<T> {
        return context.success(this.result);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        return position as int;
    }

    override copy(): EpsilonParser<T> {
        return new EpsilonParser(this.result);
    }

    override hasEqualProperties(other: EpsilonParser<T>): boolean {
        return super.hasEqualProperties(other) && this.result === other.result;
    }
}