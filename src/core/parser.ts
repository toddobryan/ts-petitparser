/* eslint-disable @typescript-eslint/no-explicit-any */
import { type int, type ContinuationHandler } from "../common";
import {Context, Result} from "./context_result_and_errors";
import {Callback, Predicate} from "../shared/types";
import {Token} from "./token";
import {FailureFactory} from "../parser/action/where";

export { type Parser };

interface Parser<T> {
    /**
     * Primitive method doing the actual parsing.
     *
     * The method is overridden in concrete subclasses to implement the
     * parser specific logic. The method takes a parse {@link Context} and
     * returns the resulting context, which is either a {@link Success} or
     * {@link Failure} context.
     */
    parseOn(context: Context): Result<T>;

    /**
     * Returns a shallow copy of the receiver.
     * Override this method in all subclasses, return its own type.
     */
    copy(): Parser<T>;

    /**
     * Primitive method doing the actual parsing.
     *
     * This method is an optimized version of {@link Parser#parseOn} that is getting
     * its speed advantage by avoiding any unnecessary memory allocations.
     *
     * The method is overridden in most concrete subclasses to implement the
     * optimized logic. As an input the method takes a [buffer] and the current
     * [position] in that buffer. It returns a new (positive) position in case
     * of a successful parse, or `-1` in case of a failure.
     *
     * Subclasses don't necessarily have to override this method, since it is
     * emulated using its slower brother.
     */
    fastParseOn(buffer: string, position: int | number): int;

    /**
     * Returns the parse result of the [input].
     *
     * The implementation creates a default parse context on the input and calls
     * the internal parsing logic of the receiving parser.
     *
     * For example, `letter().plus().parse('abc')` results in an instance of
     * [Success], where [Context.position] is `3` and [Success.value] is `[a, b, c]`.
     *
     * Similarly, `letter().plus().parse('123')` results in an instance of
     * [Failure], where [Context.position] is `0` and [Failure.message] is
     * `'letter expected'`.
     */
    parse(input: string, start?: int | number): Result<T>;

    /**
     * Recursively tests for structural equality of two parsers.
     * The code automatically deals with recursive parsers and parsers that
     * refer to other parsers. Do not override this method, instead customize
     * [Parser.hasEqualProperties] and [Parser.children].
     */
    isEqualTo(other: Parser<any>, seen?: Set<Parser<any>>): boolean;

    /**
     * Compare the properties of two parsers.
     * Override this method in all subclasses that add new state.
     */
    hasEqualProperties(other: Parser<T>): boolean;

    /**
     * Compare the children of two parsers.
     *
     * Normally this method does not need to be overridden, as this method works
     * generically on the returned [Parser.children].
     */
    hasEqualChildren(other: Parser<any>, seen: Set<Parser<any>>): boolean;

    /**
     * Returns a list of directly referenced parsers.
     *
     * For example, `letter().children` returns the empty collection `[]`,
     * because the letter parser is a primitive or leaf parser that does not
     * depend on or call any other parser.
     *
     * In contrast, `letter().or(digit()).children` returns a collection
     * containing both the `letter()` and `digit()` parser.
     *
     * Override this method and [Parser.replace] in all subclasses that
     * reference other parsers.
     */
    get children(): Parser<any>[];

    /**
     * Changes the receiver by replacing [source] with [target]. Does nothing
     * if [source] does not exist in [Parser.children].
     *
     * The following example creates a letter parser and then defines a parser
     * called `example` that accepts one or more letters. Eventually the parser
     * `example` is modified by replacing the `letter` parser with a new parser
     * that accepts a digit. The resulting `example` parser accepts
     * one or more digits.
     *
     * ```dart
     * const letter = letter();
     * const example = letter.plus();
     * example.replace(letter, digit());
     * ```
     *
     * Override this method and [Parser.children] in all subclasses that reference other parsers.
     */
    replace(source: Parser<any>, target: Parser<any>): void;

    captureResultGeneric<U>(callback: <V>(self: Parser<V>) => U): U;

    runtimeType(): string;

    // Added because Typescript doesn't like empty interfaces
    get isSequential(): boolean;

    // Extensions in Dart code, so must be part of separate class
    accept(input: string, start?: int | number): boolean;

    and(): Parser<T>;

    callCC<U>(handler: ContinuationHandler<T, U>): Parser<U>;

    cast<U>(): Parser<U>;

    castList<U>(): Parser<U[]>;

    flatten(message?: string): Parser<string>;

    map<U>(callback: Callback<T, U>, hasSideEffects: boolean): Parser<U>;

    permute(indexes: int[] | number[]): Parser<T[]>;

    pick<U>(index: int | number): Parser<U>;

    token(): Parser<Token<T>>;

    trim(left?: Parser<unknown>, right?: Parser<unknown>): Parser<T>;

    where(predicate: Predicate<T>, message?: string, factory?: FailureFactory<T>): Parser<T>;
}

