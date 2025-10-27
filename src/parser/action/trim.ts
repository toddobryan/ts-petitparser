/* eslint-disable @typescript-eslint/no-explicit-any */
import { type int } from "../../common";
import { type Parser } from "../../core/parser";
import { Context, Failure, StateError } from "../../core/context_result_and_errors";
import { DelegateParser } from "../combinator/delegate";

export { TrimmingParser };

class TrimmingParser<T> extends DelegateParser<T, T> {
    left: Parser<any>;
    right: Parser<any>;

    constructor(delegate: Parser<T>, left: Parser<any>, right: Parser<any>) {
        super(delegate);
        this.left = left;
        this.right = right;
    }

    parseOn(context: Context) {
        const buffer = context.buffer;
        const before = trim(this.left, buffer, context.position);
        if (before !== context.position) {
            context = new Context(buffer, before);
        }
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            const after = trim(this.right, buffer, result.position);
            return after === result.position ? result : result.success(result.value, after);
        }
    }

    override fastParseOn(buffer: string, position: int | number): int {
        const result = this.delegate.fastParseOn(buffer, trim(this.left, buffer, position as int));
        return result < 0 ? -1 as int : trim(this.right, buffer, result);
    }

    copy(): TrimmingParser<T> {
        return new TrimmingParser<T>(this.delegate, this.left, this.right);
    }

    override replace(source: Parser<any>, target: Parser<any>): void {
        super.replace(source, target);
        if (this.left === source) {
            this.left = target;
        }
        if (this.right === source) {
            this.right = target;
        }
    }
}

const trim = (parser: Parser<any>, buffer: string, position: int): int => {
    while (true) {
        const result = parser.fastParseOn(buffer, position);
        if (result === position) {
            throw new StateError(`${parser} must always consume`)
        } else if (result < 0) {
            break;
        } else {
            position = result;
        }
    }
    return position;
}