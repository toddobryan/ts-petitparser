import type { int } from "../../common";
import type { Parser } from "../../core/parser";
import { predicate } from "./predicate";

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