import type { int } from "../../common";
import { Parser } from "../../core/parser";
import type { Context, Result } from "../../core/context_result_and_errors";
import {ParserImpl} from "../../core/parserImpl";

export { FailureParser, failure };

const failure = (message: string = "unable to parse"): Parser<never> => {
    return new FailureParser(message);
}

class FailureParser extends ParserImpl<never> {
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