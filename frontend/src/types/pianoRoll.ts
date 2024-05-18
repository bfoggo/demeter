import type { Note } from "./note";

export enum TimeSignatureDenominator {
    Quarter = 4,
    Eighth = 8,
}

export enum BeatComplexity {
    Simple,
    Compound,
}

type ComplexityPattern = BeatComplexity[];
export function beatPatternStr(pattern: ComplexityPattern): string {
    return pattern.map(beat => beat === BeatComplexity.Simple ? "S" : "C").join("");
}
export function parseBeatPatternString(patternStr: string): ComplexityPattern {
    if (patternStr === undefined || patternStr === null || patternStr === "") {
        return [];
    }
    console.log(patternStr);
    return patternStr.split("").map(char => char === "S" ? BeatComplexity.Simple : BeatComplexity.Compound);
}

function twosAndThreesSummingToN(n: number): { twos: number, threes: number }[] {
    // All (x,y) such that 2x + 3y = n
    if (n < 2) {
        throw new Error("n must be at least 2");
    }
    const results = [];
    for (let i = 0; i <= Math.floor(n / 2); i++) {
        if ((n - 2 * i) % 3 === 0) {
            results.push({ twos: i, threes: (n - 2 * i) / 3 });
        }
    }
    return results;
}

function distinguishablePermutations(symbols: any[]): any[][] {
    if (symbols.length === 0) {
        return [[]]
    }
    if (symbols.length === 1) {
        return [symbols];
    }
    const results: any[][] = [];
    for (let i = 0; i < symbols.length; i++) {
        const rest = [...symbols];
        rest.splice(i, 1);
        const restPermutations = distinguishablePermutations(rest);
        for (const restPermutation of restPermutations) {
            for (let j = 0; j <= restPermutation.length; j++) {
                const permutation = [...restPermutation];
                permutation.splice(j, 0, symbols[i]);
                if (!results.find(result => result.join("") === permutation.join(""))) {
                results.push(permutation);
                }
            }
        }
    }
    return results;
}

export class TimeSignature {
    numerator: number;
    denominator: TimeSignatureDenominator;

    constructor(numerator: number, denominator: TimeSignatureDenominator) {
        if (Math.round(numerator) !== numerator) {
            throw new Error("Numerator must be an integer");
        }

        this.numerator = numerator;
        this.denominator = denominator;
    }

    complexityPatterns(): ComplexityPattern[] {
        switch (this.denominator) {
            case TimeSignatureDenominator.Quarter:
                return [Array.from({ length: this.numerator }, () => BeatComplexity.Simple)] as ComplexityPattern[];
            case TimeSignatureDenominator.Eighth:
                var results: ComplexityPattern[] = []
                for (const twoThree of twosAndThreesSummingToN(this.numerator)) {
                    const pattern = Array.from({ length: twoThree.twos }, () => BeatComplexity.Simple).concat(Array.from({ length: twoThree.threes }, () => BeatComplexity.Compound));
                    results.push(...distinguishablePermutations(pattern) as ComplexityPattern[]);
                }
                return results;
        }
    }

    static allNumerators(): number[] {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    }

    static allDenominators(): TimeSignatureDenominator[] {
        return [TimeSignatureDenominator.Quarter, TimeSignatureDenominator.Eighth];
    }
}


export class PianoRollGrid {
    measures: number;
    numKeys: number;
    keyHeight: number;
    eighthNoteWidth: number;

    constructor(measures: number, numKeys: number, keyHeight: number, eighthNoteWidth: number) {
        this.measures = measures;
        this.numKeys = numKeys;
        this.keyHeight = keyHeight;
        this.eighthNoteWidth = eighthNoteWidth;
    }

    setMeasures(measures: number)  {
        this.measures = measures;
    }

    totalWidth(timeSignature: TimeSignature): number {
        switch (timeSignature.denominator) {
            case TimeSignatureDenominator.Quarter:
                return this.measures * timeSignature.numerator * 2 * this.eighthNoteWidth;
            case TimeSignatureDenominator.Eighth:
                return this.measures * timeSignature.numerator * this.eighthNoteWidth;
        }
    }

    totalHeight(): number {
        return this.numKeys * this.keyHeight;
    }

    majorLinesPosX(complexityPattern: ComplexityPattern): number[] {
        const gridLines = [];
        let current = 0;
        for (const complexity of complexityPattern) {
            gridLines.push(current);
            if (complexity === BeatComplexity.Simple) {
                current += 2 * this.eighthNoteWidth;
            } else {
                current += 3 * this.eighthNoteWidth;
            }
        }
        gridLines.push(current);
        return gridLines;
    }

    minorLinesPosX(timeSignature: TimeSignature): number[] {
        const gridLines = [];
        let current = 0;
        for (let i = 0; i < this.measures * timeSignature.numerator; i++) {
            gridLines.push(current);
            current += timeSignature.denominator === TimeSignatureDenominator.Quarter ? 2 * this.eighthNoteWidth : this.eighthNoteWidth;
            gridLines.push(current);
        }
        return gridLines;

    }

}