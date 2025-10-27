import {Parser} from "./parser";
import {Callback, Predicate} from "../shared/types";
import {ContinuationHandler, int} from "../common";
import {Token} from "./token";
import {FailureFactory} from "../parser/action/where";

export {type ParserExtension};

interface ParserExtension<T> {
    and(p: Parser<T>): Parser<T>;

    callCC<U>(p: Parser<T>, handler: ContinuationHandler<T, U>): Parser<U>;

    cast<U>(p: Parser<T>): Parser<U>;

    castList<U>(p: Parser<T>): Parser<U[]>;

    flatten(p: Parser<T>, message?: string): Parser<string>;

    map<U>(p: Parser<T>, callback: Callback<T, U>, hasSideEffects: boolean): Parser<U>;

    permute<U>(p: Parser<T>, indexes: int[] | number[]): Parser<U[]>;

    pick<U>(p: Parser<T>, index: int | number): Parser<U>;

    token(p: Parser<T>): Parser<Token<T>>;

    trim(p: Parser<T>, left?: Parser<unknown>, right?: Parser<unknown>): Parser<T>;

    where(
        p: Parser<T>,
        predicate: Predicate<T>,
        message?: string,
        factory?: FailureFactory<T>
    ): Parser<T>;
}

