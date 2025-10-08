import { CharacterPredicate } from "../predicate.js";

export { LetterCharPredicate };

class LetterCharPredicate extends CharacterPredicate {
    constructor() {
        super();
    }

    test(charCode: number): boolean {
        return (65 <= charCode && charCode <= 90) || (97 <= charCode && charCode <= 122);
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof LetterCharPredicate;
    }
}