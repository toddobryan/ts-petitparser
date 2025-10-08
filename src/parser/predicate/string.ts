import type { int } from "../../common.js";
import type { Parser } from "../../core/parser.js";
import { predicate } from "./predicate.js";

export { string };

const string = (string: string, message?: string, ignoreCase: boolean = false): Parser<string> => {
    return ignoreCase ?
        predicate(
            string.length as int, 
            (s: string) => s.toLocaleLowerCase() === string.toLocaleLowerCase(), 
            message ?? `"${string}" (case-insensitive) expected`,
        ) :
        predicate(
            string.length as int,
            (s: string) => s === string,
            message ?? `"${string}" expected`
        )
}