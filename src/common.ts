export { genArray };
export type { int };

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