import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { LetterCharPredicate } from "./predicate/letter";

export { letter };

const letter = (message: string = "letter expected"): Parser<string> => {
    return CharacterParser.create(new LetterCharPredicate(), message);
}