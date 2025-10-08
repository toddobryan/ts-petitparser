/* eslint-disable @typescript-eslint/no-explicit-any */
import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import type { Parser } from "../../core/parser.js";
import { Failure, type Result } from "../../core/result.js";
import { SeparatedList } from "../utils/separated_list.js";
import { RepeatingParser } from "./repeating.js";

export { SeparatedRepeatingParser };

class SeparatedRepeatingParser<T, U> extends RepeatingParser<T, SeparatedList<T, U>> {
    separator: Parser<U>;

    constructor(delegate: Parser<T>, separator: Parser<U>, min: int | number, max: int | number | null) {
        super(delegate, min, max);
        this.separator = separator;
    }

    override parseOn(context: Context): Result<SeparatedList<T, U>> {
        let current = context;
        const elements: T[] = [];
        const separators: U[] = [];
        while (elements.length < this.min) {
            if (elements.length > 0) {
                const separation = this.separator.parseOn(current);
                if (separation instanceof Failure) {
                    return separation;
                }
                current = separation;
                separators.push(separation.value);
            }
            const result = this.delegate.parseOn(current);
            if (result instanceof Failure) {
                return result;
            }
            current = result;
            elements.push(result.value);
        }
        while (this.max && elements.length < this.max) {
            const previous = current;
            if (elements.length > 0) {
                const separation = this.separator.parseOn(current);
                if (separation instanceof Failure) {
                    break;
                }
                current = separation;
                separators.push(separation.value);
            }
            const result = this.delegate.parseOn(current);
            if (result instanceof Failure) {
                if (elements.length > 0) {
                    separators.pop();
                }
                return previous.success(new SeparatedList(elements, separators));
            }
            current = result;
            elements.push(result.value);
        }
        return current.success(new SeparatedList(elements, separators));
    }

    override fastParseOn(buffer: string, position: int | number): int {
        let count = 0;
        let current = position as int;
        while (count < this.min) {
            if (count > 0) {
                const separation = this.separator.fastParseOn(buffer, current);
                if (separation < 0) {
                    return -1 as int;
                }
                current = separation;
            }
            const result = this.delegate.fastParseOn(buffer, current);
            if (result < 0) {
                return -1 as int;
            }
            count++;
            current = result;
        }
        while (this.max && count < this.max) {
            const previous = current;
            if (count > 0) {
                const separation = this.separator.fastParseOn(buffer, current);
                if (separation < 0) {
                    return previous;
                }
                current = separation;
            }
            const result = this.delegate.fastParseOn(buffer, current);
            if (result < 0) {
                return previous;
            }
            count++;
            current = result;
        }
        return current;
    }

    override get children(): Parser<any>[] {
        return [this.delegate, this.separator];
    }

    override replace(source: Parser<any>, target: Parser<any>): void {
        super.replace(source, target);
        if (this.separator === source) {
            this.separator = target as Parser<U>;
        }
    }

    override copy(): SeparatedRepeatingParser<T, U> {
        return new SeparatedRepeatingParser(this.delegate, this.separator, this.min, this.max);
    }
    
}