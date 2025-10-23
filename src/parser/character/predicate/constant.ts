import { CharacterPredicate } from "../predicate";

export { ConstantCharPredicate };

class ConstantCharPredicate extends CharacterPredicate {
    readonly constant: boolean;

    constructor(constant: boolean) {
        super();
        this.constant = constant;
    }
    
    static any = new ConstantCharPredicate(true);
    static none = new ConstantCharPredicate(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(_charCode: number): boolean {
        return this.constant;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof ConstantCharPredicate && this.constant == other.constant;
    }

    override toString(): string {
        return `${super.toString()}(${this.constant})`;
    }
}