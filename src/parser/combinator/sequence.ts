import type { int } from "../../common";
import type { Parser } from "../../core/parser";
import { Context, Failure, type Result } from "../../core/context_result_and_errors";
import { ListParser } from "./list";

export { SequenceParser };

class SequenceParser<T> extends ListParser<T, T[]> {
    constructor(children: Parser<T>[]) {
        super(children);
    }

    override parseOn(context: Context): Result<T[]> {
        let current = context;
        const elements: T[] = [];
        for (let i = 0; i < this.children.length; i++) {
            const result = this.children[i]!.parseOn(current);
            if (result instanceof Failure) {
                return result;
            } else {
                elements.push(result.value);
                current = result;
            }
        }
        return current.success(elements);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        for (let i = 0; i < this.children.length; i++) {
            position = this.children[i]!.fastParseOn(buffer, position);
            if (position < 0) {
                return position as int;
            }
        }
        return position as int;
    }

    override copy(): SequenceParser<T> {
        return new SequenceParser(this.children);
    }
}