import { CharacterPredicate } from "../predicate.js";

export { DigitCharPredicate };

class DigitCharPredicate extends CharacterPredicate {
    constructor() {
        super();
    }

    test(charCode: number): boolean {
        return 48 <= charCode && charCode <= 57;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof DigitCharPredicate;
    }
}