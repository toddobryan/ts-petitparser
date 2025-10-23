import type { int } from "../../common";
import type { Context } from "../../core/context";
import { StateError } from "../../core/errors";
import type { Parser } from "../../core/parser";
import { Failure, type Result } from "../../core/result";
import { selectLast, type FailureJoiner } from "../utils/failure_joiner";
import { ListParser } from "./list";

export { ChoiceParser, toChoiceParser };

const toChoiceParser = <T>(parsers: Iterable<Parser<T>>, failureJoiner?: FailureJoiner): ChoiceParser<T> => {
    return new ChoiceParser<T>([...parsers], failureJoiner);
}

class ChoiceParser<T> extends ListParser<T, T> {
    readonly failureJoiner: FailureJoiner;

    constructor(children: Parser<T>[], failureJoiner?: FailureJoiner) {
        super(children);
        if (children.length === 0) {
            throw new StateError("Choice parser cannot be empty");
        }
        this.failureJoiner = failureJoiner ?? selectLast;
    }

    override parseOn(context: Context): Result<T> {
        const result: Result<T> = this.children[0]!.parseOn(context);
        if (! (result instanceof Failure)) {
            return result;
        }
        let failure = result;
        for (let i = 1; i < this.children.length; i++) {
            const result = this.children[i]!.parseOn(context);
            if (! (result instanceof Failure)) {
                return result;
            } else {
                failure = this.failureJoiner(failure, result);
            }
        }
        return failure;
    }

    override fastParseOn(buffer: string, position: int | number): int {
        let result = -1;
        for (let i = 0; i < this.children.length; i++) {
            result = this.children[i]!.fastParseOn(buffer, position);
            if (result >= 0) {
                return result as int;
            }
        }
        return result as int;
    }
    
    override hasEqualProperties(other: ChoiceParser<T>): boolean {
        return super.hasEqualProperties(other) && this.failureJoiner === other.failureJoiner;
    }

    override copy(): ChoiceParser<T> {
        return new ChoiceParser(this.children, this.failureJoiner);
    }
}