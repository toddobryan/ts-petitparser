import {type Context, type Result} from "./core/context_result_and_errors";

export { genArray };
export type { int, ContinuationHandler, ContinuationFunction };

type int = number & { __int__: void };

const genArray = <T>(l: number, funct: (i: number) => T): T[] => {
    if (!Number.isInteger(l)) {
        throw TypeError(`${l} should be an integer`);
    }
    const newArray = new Array<T>(l);
    for (let i = 0; i < l; i++) {
        newArray[i] = funct(i);
    }
    return newArray;
}

type ContinuationHandler<T, U> = (continuation: ContinuationFunction<T>, context: Context) => Result<U>;

type ContinuationFunction<T> = (context: Context) => Result<T>;
