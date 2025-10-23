import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { toReadableString } from "./utils/code";
import { optimizedString } from "./utils/optimize";

export { anyOf }

const anyOf = (value: string, message?: string, ignoreCase: boolean = false, unicode: boolean = false): Parser<string> => {
    const predicate = optimizedString(value, ignoreCase, unicode);
    message ??= `any of ${toReadableString(value, unicode)}${ignoreCase ? " (case insensitive)" : ""} expected`;
    return CharacterParser.create(predicate, message, unicode);
}