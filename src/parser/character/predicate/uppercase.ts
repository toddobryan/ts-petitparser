import { CharacterPredicate } from "../predicate.js";

export { UppercaseCharPredicate };

class UppercaseCharPredicate extends CharacterPredicate {
    constructor() {
        super();
    }

    test(charCode: number): boolean {
        return 65 <= charCode && charCode <= 90;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof UppercaseCharPredicate;
    }
}