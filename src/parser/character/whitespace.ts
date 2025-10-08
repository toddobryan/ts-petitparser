import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { WhitespaceCharPredicate } from "./predicate/whitespace.js";

export { whitespace };

const whitespace = (message: string = "whitespace expected"): Parser<string> => {
    return CharacterParser.create(new WhitespaceCharPredicate(), message);
}
