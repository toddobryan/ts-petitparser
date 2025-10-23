import { StateError } from "../../../core/errors";

export { codePoints, toCharCode, toReadableString };

const toCharCode = (value: string, unicode: boolean): number => {
    const codes: number[] = codePoints(value, unicode);
    if (codes.length !== 1) {
        throw new StateError(`"${value}" is not a valid character`);
    }
    return codes[0]!;
}

const toReadableString = (value: string, unicode: boolean): string => {
    const theCodePoints = codePoints(value, unicode);
    return theCodePoints.map((code: number) => {
        if (escapedChars.has(code)) {
            return escapedChars.get(code)!;
        } else if (code < 0x20) {
            return `\\x${code.toString(16).padStart(2, "0")}`;
        } else {
            return String.fromCodePoint(code);
        }
    }).join();
}

const codePoints = (value: string, unicode: boolean): number[] => {
    let codes: number[] = new Array<number>();
    if (unicode) {
        codes = Array.from(value, char => char.codePointAt(0)!);
    } else {
        for (let i = 0; i < value.length; i++) {
            codes.push(value.charCodeAt(i));
        }
    }
    return codes;
}

const escapedChars = new Map([
    [0x08, "\\b"],
    [0x09, "\\t"],
    [0x0A, "\\n"],
    [0x0B, "\\v"],
    [0x0C, "\\f"],
    [0x0D, "\\r"],
    [0x22, "\""],
    [0x27, "'"],
    [0x5C, "\\\\"],
]);