/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type int } from "../common";
import { Context, Failure, Result } from "./result";

export { Parser };

/** Abstract base class of all parsers that producea parse result of type T. */
abstract class Parser<T> {
    constructor() {}

    /**
     * Primitive method doing the actual parsing.
     * 
     * The method is overridden in concrete subclasses to implement the
     * parser specific logic. The methods takes a parse {@link Context} and
     * returns the resulting context, which is either a {@link Success} or
     * {@link Failure} context.
     */
    abstract parseOn(context: Context): Result<T>;

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
    fastParseOn(buffer: string, position: int | number): int {
        const result: Result<T> = this.parseOn(new Context(buffer, position as int));
        return result instanceof Failure ? -1 as int : result.position;
    }

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
    parse(input: string, start: int | number = 0): Result<T> {
        return this.parseOn(new Context(input, start as int));
    }

    /**
     * Returns a shallow copy of the receiver.
     * Override this method in all subclasses, return its own type.
     */
    abstract copy(): Parser<T>;

    /**
     * Recursively tests for structural equality of two parsers.
     * The code automatically deals with recursive parsers and parsers that
     * refer to other parsers. Do not override this method, instead customize
     * [Parser.hasEqualProperties] and [Parser.children].
     */
    isEqualTo(other: Parser<any>, seen: Set<Parser<any>> = new Set<Parser<any>>()): boolean {
        if (this === other) {
            return true;
        } else if (this.constructor !== other.constructor || !this.hasEqualProperties(other)) {
            return false;
        }
        if (seen.has(this)) {
            return true;
        } else {
            seen.add(this);
            return this.hasEqualChildren(other, seen);
        }
    }

    /**
     * Compare the properties of two parsers.
     * Override this method in all subclasses that add new state.
     */
    hasEqualProperties(other: Parser<T>): boolean{
        return true;
    }

    /** 
     * Compare the children of two parsers.
     * 
     * Normally this method does not need to be overridden, as this method works
     * generically on the returned [Parser.children].
     */
    hasEqualChildren(other: Parser<any>, seen: Set<Parser<any>>): boolean {
        const thisChildren = this.children;
        const otherChildren = other.children;
        if (thisChildren.length !== otherChildren.length) {
            return false;
        }
        for (let i = 0; i < thisChildren.length; i++) {
            if (!thisChildren[i]!.isEqualTo(otherChildren[i]!, seen)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns a list of directly referenced parsers.
     * 
     * For example, `letter().children` returns the empty collection `[]`,
     * because the letter parser is a primitive or leaf parser that does not
     * depend or call any other parser.
     * 
     * In contrast, `letter().or(digit()).children` returns a collection
     * containing both the `letter()` and `digit()` parser.
     * 
     * Override this method and [Parser.replace] in all subclasses that
     * reference other parsers.
     */
    get children(): Parser<any>[] {
        return [];
    }

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
    replace(_source: Parser<any>, _target: Parser<any>): void {}


    captureResultGeneric<U>(callback: <V>(self: Parser<V>) => U): U {
        return callback<T>(this);
    }

    get runtimeType(): string {
        return this.constructor.name;
    }

    toString(): string {
        return this.constructor.name;
    }

    // Added because Typescript doesn't like empty interfaces
    get isSequential(): boolean {
        return false;
    }

    // Extensions in Dart code
    /*accept(input: string, start: int = 0 as int): boolean {
        return this.fastParseOn(input, start) > 0;
    }

    and(): Parser<T> {
        return new AndParser(this);
    }

    callCC<U>(handler: ContinuationHandler<T, U>): Parser<U> {
        return new ContinuationParser(this, handler);
    }

    cast<U>(): Parser<U> {
        return new CastParser<T, U>(this);
    }

    castList<U>(): Parser<U[]> {
        return new CastListParser<T, U>(this);
    }

    flatten(message?: string) {
        return new FlattenParser(this, message);
    }

    map<U>(callback: Callback<T, U>, hasSideEffects: boolean = false) {
        return new MapParser<T, U>(this, callback, hasSideEffects);
    }

    permute<U>(indexes: int[] | number[]): Parser<U[]> {
        return new PermuteParser<U>(this as unknown as Parser<U[]>, indexes as int[]);
    }

    pick<U>(index: int | number): Parser<U> {
        return new PickParser(this as unknown as Parser<U[]>, index as int);
    }

    token(): Parser<Token<T>> {
        return new TokenParser<T>(this);
    }

    trim(left?: Parser<any>, right?: Parser<any>): Parser<T> {
        const leftDefined = left ??= whitespace();
        return new TrimmingParser(this, leftDefined, right ??= leftDefined);
    }

    where(predicate: Predicate<T>, message?: string, factory?: FailureFactory<T>): Parser<T> {
        return new WhereParser(this, predicate, factory ?? defaultFactory(message))
    }*/
}