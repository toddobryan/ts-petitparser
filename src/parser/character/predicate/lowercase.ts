import { CharacterPredicate } from "../predicate.js";

export { LowercaseCharPredicate };

class LowercaseCharPredicate extends CharacterPredicate {
    constructor() {
        super();
    }

    test(charCode: number): boolean {
        return 97 <= charCode && charCode <= 122;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof LowercaseCharPredicate;
    }
}