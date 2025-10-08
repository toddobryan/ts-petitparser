import { CharacterPredicate } from "../predicate.js";

export { SingleCharPredicate };

class SingleCharPredicate extends CharacterPredicate {
    readonly charCode: number;

    constructor(charCode: number) {
        super();
        this.charCode = charCode;
    }

    test(charCode: number): boolean {
        return charCode === this.charCode;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof SingleCharPredicate && this.charCode === other.charCode;
    }

    override toString(): string {
        return `${super.toString}(${this.charCode})`;
    }
}