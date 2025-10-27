import {ParserExtension} from "./parserExtension";
import {Parser} from "./parser";
import {AndParser} from "../parser/combinator/and";
import {ContinuationParser} from "../parser/action/continuation";
import {CastParser} from "../parser/action/cast";
import {CastListParser} from "../parser/action/cast_list";
import {FlattenParser} from "../parser/action/flatten";
import {Callback, Predicate} from "../shared/types";
import {MapParser} from "../parser/action/map";
import {ContinuationHandler, int} from "../common";
import {PermuteParser} from "../parser/action/permute";
import {PickParser} from "../parser/action/pick";
import {Token} from "./token";
import {TokenParser} from "../parser/action/token";
import {whitespace} from "../parser/character/whitespace";
import {TrimmingParser} from "../parser/action/trim";
import {defaultFactory, FailureFactory, WhereParser} from "../parser/action/where";
import {injectable} from "tsyringe";

export { ParserExtensionImpl };

@injectable()
class ParserExtensionImpl<T> implements ParserExtension<T> {
    and(p: Parser<T>): Parser<T> {
        return new AndParser(p);
    }

    callCC<U>(p: Parser<T>, handler: ContinuationHandler<T, U>): Parser<U> {
        return new ContinuationParser(p, handler);
    }

    cast<U>(p: Parser<T>): Parser<U> {
        return new CastParser<T, U>(p);
    }

    castList<U>(p: Parser<T>): Parser<U[]> {
        return new CastListParser<T, U>(p);
    }

    flatten(p: Parser<T>, message?: string): Parser<string> {
        return new FlattenParser(p, message);
    }

    map<U>(p: Parser<T>, callback: Callback<T, U>, hasSideEffects: boolean = false): Parser<U> {
        return new MapParser<T, U>(p, callback, hasSideEffects);
    }

    permute<U>(p: Parser<T>, indexes: int[] | number[]): Parser<U[]> {
        return new PermuteParser<U>(p as unknown as Parser<U[]>, indexes as int[]);
    }

    pick<U>(p: Parser<T>, index: int | number): Parser<U> {
        return new PickParser(p as unknown as Parser<U[]>, index as int);
    }

    token(p: Parser<T>, ): Parser<Token<T>> {
        return new TokenParser<T>(p);
    }

    trim(p: Parser<T>, left?: Parser<unknown>, right?: Parser<unknown>): Parser<T> {
        const leftDefined: Parser<unknown> = left ?? whitespace();
        return new TrimmingParser(p, leftDefined, right ?? leftDefined);
    }

    where(p: Parser<T>, predicate: Predicate<T>, message?: string, factory?: FailureFactory<T>): Parser<T> {
        return new WhereParser(p, predicate, factory ?? defaultFactory(message))
    }
}