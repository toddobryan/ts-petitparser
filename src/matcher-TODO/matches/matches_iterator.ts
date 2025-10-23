import { type int } from "../../common";
import { Context } from "../../core/context";
import { Parser } from "../../core/parser";

export { MatchesIterator };

class MatchesIterator<T> implements Iterator<T> {
    readonly parser: Parser<T>;
    readonly input: string;
    start: int;
    readonly overlapping: boolean;
    current: T | undefined = undefined;

    constructor(parser: Parser<T>, input: string, start: int, overlapping: boolean) {
        this.parser = parser;
        this.input = input;
        this.start = start;
        this.overlapping = overlapping;
    }

    next(): IteratorResult<T> {
        while (this.start <= this.input.length) {
            const end = this.parser.fastParseOn(this.input, this.start);
            if (end < 0) {
                this.start++;
            } else {
                this.current = this.parser.parseOn(new Context(this.input, this.start)).value;
                if (this.overlapping || this.start == end) {
                    this.start++;
                } else {
                    this.start = end;
                }
                return { value: this.current, done: false };
            }
        }
        return { value: this.current, done: true };
    }
}
