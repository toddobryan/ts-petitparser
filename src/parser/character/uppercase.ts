import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { UppercaseCharPredicate } from "./predicate/uppercase.js";

export { uppercase };

const uppercase = (message: string = "uppercase letter expected"): Parser<string> => {
    return CharacterParser.create(new UppercaseCharPredicate(), message);
}
