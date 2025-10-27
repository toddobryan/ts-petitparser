import { type int } from "../common";

export { Token };

class Token<T> {
    readonly value: T
    readonly buffer: string
    readonly start: int
    readonly stop: int

    constructor(value: T, buffer: string, start: int, stop: int) {
        this.value = value;
        this.buffer = buffer;
        this.start = start;
        this.stop = stop;
     }

    get line(): int {
        return Token.lineAndColumnOf(this.buffer, this.start)[0];
    }

    get column(): int {
        return Token.lineAndColumnOf(this.buffer, this.start)[1];
    }

    toString(): string {
        return `${this.constructor.name}[${Token.positionString(this.buffer, this.start)}]: ${this.value}`;
    }

    /*static newlineParser(): Parser<string> {
        return Token._newlineParser;
    }

    static _newlineParser: Parser<string> = newline();*/

    static lineAndColumnOf(buffer: string, position: int): [int, int] {
        let line = 1;
        let col = 1;
        for (let i = 0; i < position; i++) {
            if (buffer[i] === '\n') {
                line++;
                col = 1;
            } else {
                col++;
            }
        }
        return [line as int, col as int];
    }

    static positionString(buffer: string, position: int): string {
        const [line, col] = Token.lineAndColumnOf(buffer, position);
        return `${line}:${col}`;
    }
}
