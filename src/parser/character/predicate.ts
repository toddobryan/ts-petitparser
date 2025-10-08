export { CharacterPredicate };

abstract class CharacterPredicate {
    abstract test(charCode: number): boolean;

    abstract isEqualTo(other: CharacterPredicate): boolean;

    toString(): string {
        return `${this.constructor.name}`;
    }
}