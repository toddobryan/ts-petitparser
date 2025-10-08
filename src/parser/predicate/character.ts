import { Parser } from "../../core/parser.js";
import { CharacterPredicate } from "../character/predicate.js";
import { SingleCharacterParser } from "./single_character.js";
import { UnicodeCharacterParser } from "./unicode_character.js";

export { CharacterParser };

abstract class CharacterParser extends Parser<string> {
    readonly predicate: CharacterPredicate;
    readonly message: string;

    constructor(predicate: CharacterPredicate, message: string) {
        super();
        this.predicate = predicate;
        this.message = message;
    }

    static create(
        predicate: CharacterPredicate,
        message: string,
        unicode: boolean = false,
    ): CharacterParser {
        if (unicode) {
            return new UnicodeCharacterParser(predicate, message);
        } else {
            return new SingleCharacterParser(predicate, message);
        }
    }

    override hasEqualProperties(other: CharacterParser): boolean {
        return super.hasEqualProperties(other) &&
        this.predicate.isEqualTo(other.predicate) &&
        this.message === other.message;
    }

}