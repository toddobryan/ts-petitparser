/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Parser } from "../core/parser";
import { ReferenceParser } from "./internal/reference";

export { ref, ref0, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9 };

const ref = <T>(funct: Function, ...args: any[]): Parser<T> => {
    return new ReferenceParser<T>(funct, args);
}

const ref0 = <T>(funct: () => Parser<T>): Parser<T> => {
    return new ReferenceParser<T>(funct, []);
}

const ref1 = <T, A1>(funct: (a1: A1) => Parser<T>, a1: A1): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1]);
}

const ref2 = <T, A1, A2>(funct: (a1: A1, a2: A2) => Parser<T>, a1: A1, a2: A2): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1, a2]);
}

const ref3 = <T, A1, A2, A3>(funct: (a1: A1, a2: A2, a3: A3) => Parser<T>, a1: A1, a2: A2, a3: A3): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1, a2, a3]);
}

const ref4 = <T, A1, A2, A3, A4>(funct: (a1: A1, a2: A2, a3: A3, a4: A4) => Parser<T>, a1: A1, a2: A2, a3: A3, a4: A4): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1, a2, a3, a4]);
}

const ref5 = <T, A1, A2, A3, A4, A5>(funct: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => Parser<T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1, a2, a3, a4, a5]);
}

const ref6 = <T, A1, A2, A3, A4, A5, A6>(funct: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => Parser<T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1, a2, a3, a4, a5, a6]);
}

const ref7 = <T, A1, A2, A3, A4, A5, A6, A7>(funct: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => Parser<T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1, a2, a3, a4, a5, a6, a7]);
}

const ref8 = <T, A1, A2, A3, A4, A5, A6, A7, A8>(funct: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => Parser<T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1, a2, a3, a4, a5, a6, a7, a8]);
}

const ref9 = <T, A1, A2, A3, A4, A5, A6, A7, A8, A9>(funct: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9) => Parser<T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9): Parser<T> => {
    return new ReferenceParser<T>(funct, [a1, a2, a3, a4, a5, a6, a7, a8, a9]);
}