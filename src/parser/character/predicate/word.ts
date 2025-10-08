import { CharacterPredicate } from "../predicate.js";

export { WordCharPredicate };

class WordCharPredicate extends CharacterPredicate {
    constructor() {
        super();
    }

    test(charCode: number): boolean {
        return (65 <= charCode && charCode <= 90) ||
            (97 <= charCode && charCode <= 122) ||
            (48 <= charCode && charCode <= 57) ||
            charCode === 95;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof WordCharPredicate;
    }
}