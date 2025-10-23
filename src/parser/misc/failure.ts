import type { int } from "../../common";
import type { Context } from "../../core/context";
import { Parser } from "../../core/parser";
import type { Result } from "../../core/result";

export { FailureParser, failure };

const failure = (message: string = "unable to parse"): Parser<never> => {
    return new FailureParser(message);
}

class FailureParser extends Parser<never> {
    readonly message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    override parseOn(context: Context): Result<never> {
        return context.failure(this.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override fastParseOn(buffer: string, position: int | number): int {
        return -1 as int;
    }

    override copy(): FailureParser {
        return new FailureParser(this.message);
    }

    override hasEqualProperties(other: FailureParser): boolean {
        return super.hasEqualProperties(other) && this.message === other.message;
    }

    override toString(): string {
        return `${super.toString()}[${this.message}]`;
    }
}