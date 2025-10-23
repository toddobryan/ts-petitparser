/* eslint-disable @typescript-eslint/no-explicit-any */
import { Temporal } from "temporal-polyfill";

import { Parser } from "../core/parser";
import { transformParser } from "../reflection/transform";
import { type Predicate, type VoidCallback } from "../shared/types";
import type { ContinuationFunction } from "../parser/action/continuation";
import type { Context } from "../core/context";

export { profile };

/**
 * Returns a transformed [Parser] that when being used measures
 * the activation count and total time of each parser.
 * 
 * For example, the snippet   
 * 
 * ```dart
 * final parser = letter() & word().star();
 * profile(parser).parse('f1234567890');
 * ```
 * 
 * prints the following output:
 * 
 * ```text
 *     1  2006  SequenceParser 
 *     1   697  PossessiveRepeatingParser[0..*]
 *    11   406  SingleCharacterParser[letter or digit expected]
 *     1   947  SingleCharacterParser[letter expected]
 * ```
 * 
 * The first number refers to the number of activations of each parser, 
 * and  the second number is the microseconds spent in this parser and 
 * all its  children.
 * 
 * The optional [output] callback can be used to receive [ProfileFrame]
 * objects with the full profiling information at the end of the parse.
 */
const profile = <T>(
    root: Parser<T>, 
    output: VoidCallback<ProfileFrame> = console.log,
    predicate?: Predicate<Parser<any>>,
): Parser<T> => {
    const frames: ProfileFrame[] = [];
    return transformParser(root, (parser: Parser<any>): Parser<any> => {
        if (predicate == null || predicate(parser)) {
            const frame = new _ProfileFrame(parser);
            frames.push(frame);
            return parser.callCC((continuation, context) => {
                frame.count++;
                frame._stopwatch.start();
                const result = continuation(context);
                frame._stopwatch.stop();
                return result;
            });
        } else {
            return parser;
        }
    }).callCC((continuation: ContinuationFunction<any>, context: Context) => {
        const result = continuation(context);
        for (const frame of frames) {
            output(frame);
        }
        return result;
    });
}

abstract class ProfileFrame {
    abstract get parser(): Parser<any>;
    abstract get count(): number;
    abstract get elapsed(): Temporal.Duration;
}

class _ProfileFrame extends ProfileFrame {
    _parser: Parser<any>
    _count: number;
    _stopwatch: Stopwatch;

    constructor(parser: Parser<any>) {
        super();
        this._parser = parser;
        this._count = 0;
        this._stopwatch = new Stopwatch();
    }

    get parser(): Parser<any> {
        return this._parser;
    }

    get count(): number {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
    }

    get elapsed(): Temporal.Duration {
        return this._stopwatch.elapsed;
    }

    override toString(): string {
        return `${this.count}\t${this.elapsed.microseconds}\t${this.parser}`;
    }
}

class Stopwatch {
    _start: Temporal.Instant | null;
    _stop: Temporal.Instant | null;

    constructor() {
        this._start = null;
        this._stop = null;
    }
    
    start(): void {
        const stop: Temporal.Instant | null = this._stop;
        if (stop != null) {
            this._start!.add(Temporal.Now.instant().since(stop));
            this._stop = null;
        }
    }

    stop(): void {
        this._stop ??= Temporal.Now.instant();
    }

    reset(): void {
        this._start = this._stop ?? Temporal.Now.instant();
    }

    get elapsed(): Temporal.Duration {
        if  (this._start == null) {
            return Temporal.Duration.from("PT0S");
        } else if (this._stop == null) {
            return this._start.until(Temporal.Now.instant());
        } else {
            return this._start.until(this._stop);
        }
    }
}