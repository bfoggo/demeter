import type { MusicContext } from "./context";
import type { Note } from "./note";
import { distinguishablePermutations, twosAndThreesSummingToN } from "./utils";

export type TimeSignatureDenominator = 4 | 8;
export function AllTimeSignatureDenominators(): TimeSignatureDenominator[] {
    return [4, 8];
}
export type BeatComplexity = "S" | "C";
export function allBeatComplexities(): BeatComplexity[] {
    return ["S", "C"];
}
export type ComplexityPattern = string & { __complexityPattern: never };

export enum Division {
    Whole = "Whole",
    Half = "Half",
    Quarter = "Quarter",
    Eighth = "Eighth",
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
            case 4:
                return ["S".repeat(this.numerator)] as ComplexityPattern[];
            case 8:
                var results: ComplexityPattern[] = []
                for (const twoThree of twosAndThreesSummingToN(this.numerator)) {
                    const pattern = Array.from({ length: twoThree.twos }, () => "S").concat(Array.from({ length: twoThree.threes }, () => "C"));
                    let permutations = distinguishablePermutations(pattern);
                    results.push(...permutations.map(pattern => pattern.join("") as ComplexityPattern));
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
                numDivisions = 2 * this.numerator / this.denominator;
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
}

export type PianoRollNote = {
    key: number;
    startPosX: number;
    startPosY: number;
    duration: number;
}


export class PianoRollGrid {
    musicContext: MusicContext;
    keyHeight: number;
    eighthNoteWidth: number;
    notes: PianoRollNote[];

    constructor(musicContext: MusicContext, keyHeight: number, eighthNoteWidth: number) {
        this.musicContext = musicContext;
        this.keyHeight = keyHeight;
        this.eighthNoteWidth = eighthNoteWidth;
        this.notes = [];
    }

    measureWidth(): number {
        switch (this.musicContext.timeSignature.denominator) {
            case 4:
                return this.musicContext.timeSignature.numerator * 2 * this.eighthNoteWidth;
            case 8:
                return this.musicContext.timeSignature.numerator * this.eighthNoteWidth;
        }
    }

    totalWidth(): number {
        switch (this.musicContext.timeSignature.denominator) {
            case 4:
                return this.musicContext.measures * this.musicContext.timeSignature.numerator * 2 * this.eighthNoteWidth;
            case 8:
                return this.musicContext.measures * this.musicContext.timeSignature.numerator * this.eighthNoteWidth;
        }
    }

    totalHeight(): number {
        return this.musicContext.keys().length * this.keyHeight;
    }

    majorLinesPosX(): number[] {
        var gridLines: number[] = [];
        let current = 0;
        for (const complexity of this.musicContext.complexityPatternStr) {
            gridLines.push(current);
            if (complexity === "S") {
                current += 2 * this.eighthNoteWidth;
            } else {
                current += 3 * this.eighthNoteWidth;
            }
        }
        gridLines.push(current);
        let gridLinesAllMeasures = Array.from({ length: this.musicContext.measures }, (_, i) => i)
            .map(i => gridLines.slice(0, gridLines.length - 1).map(l => l + i * this.measureWidth()))
            .flat();
        return gridLinesAllMeasures;
    }

    divisionLength(): number {
        let divisionLength = this.eighthNoteWidth;
        switch (this.musicContext.division) {
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
        switch (this.musicContext.tuplet) {
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

    minorLinesPosX(): number[] {
        const gridLines = [];
        let current = 0;
        for (let i = 0; i < this.musicContext.measures * this.musicContext.timeSignature.numDivisionsPerMeasure(this.musicContext.division, this.musicContext.tuplet); i++) {
            gridLines.push(current);
            current += this.divisionLength();
        }
        return gridLines;
    }

    measureLinesPosX(): number[] {
        const timeSignature = this.musicContext.timeSignature;
        const gridLines = [];
        let current = 0;
        for (let i = 0; i < this.musicContext.measures; i++) {
            gridLines.push(current);
            current += timeSignature.denominator === 4 ? timeSignature.numerator * 2 * this.eighthNoteWidth : timeSignature.numerator * this.eighthNoteWidth;
        }
        gridLines.push(current);
        return gridLines;
    }

    posXToTime(posX: number): number {
        return posX / this.eighthNoteWidth / 2 * 60 / this.musicContext.bpm;
    }

    timeToPosX(time: number): number {
        return time / 60 * this.musicContext.bpm * (this.eighthNoteWidth * 2);
    }

    keyToPosY(key: number): number {
        return key * this.keyHeight;
    }

    posYToKey(posY: number): number {
        return Math.floor(posY / this.keyHeight);
    }

}