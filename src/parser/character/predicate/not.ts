import { CharacterPredicate } from "../predicate.js";

export { NotCharPredicate };

class NotCharPredicate extends CharacterPredicate {
    readonly predicate: CharacterPredicate;

    constructor(predicate: CharacterPredicate) {
        super();
        this.predicate = predicate;
    }

    test(charCode: number): boolean {
        return !this.predicate.test(charCode);
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof NotCharPredicate && this.predicate.isEqualTo(other.predicate);
    }

    override toString(): string {
        return `${super.toString()}(${this.predicate})`;
    }
}