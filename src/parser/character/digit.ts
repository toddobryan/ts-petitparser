import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { DigitCharPredicate } from "./predicate/digit";

export { digit };

const digit = (message: string = "digit expected"): Parser<string> => {
    return CharacterParser.create(new DigitCharPredicate(), message);
}