import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { LowercaseCharPredicate } from "./predicate/lowercase.js";

export { lowercase };

const lowercase = (message: string = "lowercase letter expected"): Parser<string> => {
    return CharacterParser.create(new LowercaseCharPredicate(), message);
}