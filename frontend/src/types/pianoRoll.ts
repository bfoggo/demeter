import type { Note } from "./note";

export enum TimeSignatureDenominator {
    Quarter = 4,
    Eighth = 8,
}

export enum BeatComplexity {
    Simple,
    Compound,
}

export enum Division {
    Whole = "Whole",
    Half = "Half",
    Quarter = "Quarter",
    Eighth  = "Eighth",
    Sixteenth = "Sixteenth",
    ThirtySecond = "ThirtySecond",
}

export function allDivisions(): Division[] {
    return [Division.Whole, Division.Half, Division.Quarter, Division.Eighth, Division.Sixteenth, Division.ThirtySecond];
}

export enum Tuplet {
    None = "None",
    Triplet = "Triplet",
    Quintuplet = "Quintuplet",
    Septuplet = "Septuplet",
    Nonuplet = "Nonuplet",
}

export function allTuplets(): Tuplet[] {
    return [Tuplet.None, Tuplet.Triplet, Tuplet.Quintuplet, Tuplet.Septuplet, Tuplet.Nonuplet];
}

type ComplexityPattern = BeatComplexity[];


export function beatPatternStr(pattern: ComplexityPattern): string {
    return pattern.map(beat => beat === BeatComplexity.Simple ? "S" : "C").join("");
}
export function parseBeatPatternString(patternStr: string): ComplexityPattern {
    if (patternStr === undefined || patternStr === null || patternStr === "") {
        return [];
    }
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

    numDivisionsPerMeasure(division: Division, tuplet: Tuplet): number {
        var numDivisions;
        switch (division) {
            case Division.Whole:
                numDivisions = this.numerator / this.denominator;
                break;
            case Division.Half:
                numDivisions =  2 * this.numerator / this.denominator;
                break
            case Division.Quarter:
                numDivisions = 4 * this.numerator / this.denominator;
                break;
            case Division.Eighth:
                numDivisions = 8 * this.numerator / this.denominator;
                break;
            case Division.Sixteenth:
                numDivisions = 16 * this.numerator / this.denominator;
                break;
            case Division.ThirtySecond:
                numDivisions = 32 * this.numerator / this.denominator;
                break;
        }
        switch (tuplet) {
            case Tuplet.None:
                return numDivisions;
            case Tuplet.Triplet:
                return numDivisions * 3 / 2;
            case Tuplet.Quintuplet:
                return numDivisions * 5 / 2;
            case Tuplet.Septuplet:
                return numDivisions * 7 / 2;
            case Tuplet.Nonuplet:
                return numDivisions * 9 / 2;
        }
        return numDivisions;
    }

    static allNumerators(): number[] {
        return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    }

    static allDenominators(): TimeSignatureDenominator[] {
        return [TimeSignatureDenominator.Quarter, TimeSignatureDenominator.Eighth];
    }
}

export class PianoRollNote {
    key: number;
    startTime: number;
    duration: number;

    constructor(key: number, startTime: number, duration: number) {
        this.key = key;
        this.startTime = startTime;
        this.duration = duration;
    }
}

export class PianoRollGrid {
    measures: number;
    numKeys: number;
    keyHeight: number;
    eighthNoteWidth: number;
    notes: PianoRollNote[];

    constructor(measures: number, numKeys: number, keyHeight: number, eighthNoteWidth: number) {
        this.measures = measures;
        this.numKeys = numKeys;
        this.keyHeight = keyHeight;
        this.eighthNoteWidth = eighthNoteWidth;
        this.notes = [];
    }

    setMeasures(measures: number) {
        this.measures = measures;
    }

    measureWidth(timeSignature: TimeSignature): number {
        switch (timeSignature.denominator) {
            case TimeSignatureDenominator.Quarter:
                return timeSignature.numerator * 2 * this.eighthNoteWidth;
            case TimeSignatureDenominator.Eighth:
                return timeSignature.numerator * this.eighthNoteWidth;
        }
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

    majorLinesPosX(timeSignature: TimeSignature, complexityPattern: ComplexityPattern): number[] {
        var gridLines: number[] = [];
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
        let gridLinesAllMeasures = Array.from({ length: this.measures }, (_, i) => i).map(i => gridLines.map(l => l + i * this.measureWidth(timeSignature))).flat();
        return gridLinesAllMeasures;
    }

    divisionLength(division: Division, tuplet: Tuplet): number {
        let divisionLength = this.eighthNoteWidth;
        switch (division) {
            case Division.Whole:
                divisionLength *= 8;
                break;
            case Division.Half:
                divisionLength *= 4;
                break;
            case Division.Quarter:
                divisionLength *= 2;
                break;
            case Division.Eighth:
                divisionLength *= 1;
                break;
            case Division.Sixteenth:
                divisionLength /= 2;
                break;
            case Division.ThirtySecond:
                divisionLength /= 4;
                break;
        }
        switch (tuplet) {
            case Tuplet.None:
                divisionLength *= 1;
                break;
            case Tuplet.Triplet:
                divisionLength *= 2 / 3;
                break;
            case Tuplet.Quintuplet:
                divisionLength *= 2 / 5;
                break;
            case Tuplet.Septuplet:
                divisionLength *= 2 / 7;
                break;
            case Tuplet.Nonuplet:
                divisionLength *= 2 / 9;
                break;
        }
        return divisionLength;
    }

    minorLinesPosX(timeSignature: TimeSignature, division: Division, tuplet: Tuplet): number[] {
        const gridLines = [];
        let current = 0;
        for (let i = 0; i < this.measures * timeSignature.numDivisionsPerMeasure(division, tuplet); i++) {
            gridLines.push(current);
            current += this.divisionLength(division, tuplet);
        }
        gridLines.push(current);
        return gridLines;
    }

    measureLinesPosX(timeSignature: TimeSignature): number[] {
        const gridLines = [];
        let current = 0;
        for (let i = 0; i < this.measures; i++) {
            gridLines.push(current);
            current += timeSignature.denominator === TimeSignatureDenominator.Quarter ? timeSignature.numerator * 2 * this.eighthNoteWidth : timeSignature.numerator * this.eighthNoteWidth;
        }
        gridLines.push(current);
        return gridLines;
    }

    posXToTime(posX: number, bpm: number): number {
        return posX / this.eighthNoteWidth * 60 / bpm;
    }

    timeToPosX(time: number, bpm: number): number {
        return time / 60 * bpm  * (this.eighthNoteWidth * 2);
    }

    keyToPosY(key: number): number {
        return key * this.keyHeight;
    }

    posYToKey(posY: number): number {
        return Math.floor(posY / this.keyHeight);
    }

}
