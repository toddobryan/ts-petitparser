import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { LetterCharPredicate } from "./predicate/letter.js";

export { letter };

const letter = (message: string = "letter expected"): Parser<string> => {
    return CharacterParser.create(new LetterCharPredicate(), message);
}