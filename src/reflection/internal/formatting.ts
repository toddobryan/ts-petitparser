import type { int } from "../../common";

export { formatIterable };

const formatIterable = <T>(objects: Iterable<T>, offset?: int): string => {
    let buffer: string = "";
    [...objects].forEach((elt: T, i: number) => {
        if (0 < i) {
            buffer += "\n";
        }
        if (offset) {
            buffer += ` ${offset + 1}: `;
        } else {
            buffer += " - ";
        }
        buffer += `${elt}`
    });
    return buffer;
}