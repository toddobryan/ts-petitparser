import { CharacterPredicate } from "../predicate.js";

export { WhitespaceCharPredicate };

class WhitespaceCharPredicate extends CharacterPredicate {
    constructor() {
        super();
    }

    test(charCode: number): boolean {
        let i = 0;
        while (i < whitespaceCodes.length) {
            const ws = whitespaceCodes[i]!;
            if (charCode > ws) {
                return false;
            } else if (charCode === ws) {
                return true;
            }
            i++;
        }
        return false;
    }

    override isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof WhitespaceCharPredicate;
    }
}

const whitespaceCodes = [
    0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x20, 0x85, 0xA0,
    0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
    0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x2028, 0x2029,
    0x202F, 0x205F, 0x3000, 0xFEFF,
];
