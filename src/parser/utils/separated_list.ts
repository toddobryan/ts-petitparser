import { StateError } from "../../core/errors";

export { SeparatedList };

class SeparatedList<T, U> {
    readonly elements: T[];
    readonly separators: U[];

    constructor(elements: T[], separators: U[]) {
        if (Math.max(0, elements.length - 1) !== separators.length) {
            throw new StateError(`Inconsistent number of elements (${elements}) and separators (${separators})`);
        }
        this.elements = elements;
        this.separators = separators;
    }

    *sequential(): Iterable<T | U> {
        for (let i = 0; i < this.elements.length; i++) {
            yield this.elements[i]!;
            if (i < this.separators.length) {
                yield this.separators[i]!;
            }
        }
    }

    foldLeft(callback: (left: T, separator: U, right: T) => T) {
        let result: T = this.elements[0]!;
        for (let i = 1; i < this.elements.length; i++) {
            result = callback(result, this.separators[i - 1]!, this.elements[i]!)
        }
        return result;
    }

    toString(): string {
        return `${this.constructor.name}${this.sequential()}`;
    }
}