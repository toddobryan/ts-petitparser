import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { DigitCharPredicate } from "./predicate/digit.js";

export { digit };

const digit = (message: string = "digit expected"): Parser<string> => {
    return CharacterParser.create(new DigitCharPredicate(), message);
}