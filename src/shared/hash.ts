/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnsupportedError } from "../core/errors.js";
import { Token } from "../core/token.js";
import { ReferenceParser } from "../definition/internal/reference.js";

export { hashCode, equals }

const hashCode = (value: any): number => {
    if (typeof value === "string") {
        return hashString(value);
    } else if (value instanceof Token) {
        return (hashCode(value) + value.start + value.stop);
    } else if (value instanceof Function) {
        return hashString(value.toString());
    } else if (value instanceof ReferenceParser) {
        return hashCode(value.funct);
    } else {
        throw new UnsupportedError(`${value} of ${typeof value} has no hashCode implementation`)
    }
}

const hashString = (s: string): number => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = 31 * hash + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const equals = (a: any, b: any): boolean => {
    if (a === b) {
        return true;
    } else if (typeof a !== typeof b) {
        return false;
    } else if (a instanceof Token && b instanceof Token) {
        return a.start === b.start &&
            a.stop === b.stop &&
            equals(a.value, b.value);
    } else if (typeof a === "string" && typeof b === "string") {
        return a === b;
    } else if (typeof a === "number" && typeof b === "number") {
        return a === b;
    } else {
        throw new UnsupportedError(`equals not implement for ${a} and ${b}`);
    }
    
}