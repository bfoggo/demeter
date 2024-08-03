import { twosAndThreesSummingToN, distinguishablePermutations } from "./utils";

export type TimeSignatureDenominator = 4 | 8;
export function allTimeSignatureDenominators(): TimeSignatureDenominator[] {
    return [4, 8];
}
export type BeatComplexity = "S" | "C";
export function allBeatComplexities(): BeatComplexity[] {
    return ["S", "C"];
}
export type ComplexityPattern = string & { __complexityPattern: never; };
export type Division = "Whole" | "Half" | "Quarter" | "Eighth" | "Sixteenth" | "ThirtySecond";
export function allDivisions(): Division[] {
    return ["Whole", "Half", "Quarter", "Eighth", "Sixteenth", "ThirtySecond"];
}
export type Tuplet = "None" | "Triplet" | "Quintuplet" | "Septuplet" | "Nonuplet";
export function allTuplets(): Tuplet[] {
    return ["None", "Triplet", "Quintuplet", "Septuplet", "Nonuplet"];
}
export type TimeSignatureNumerator = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export function allTimeSignatureNumerators(): TimeSignatureNumerator[] {
    return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
}

export type TimeSignature = {
    numerator: TimeSignatureNumerator;
    denominator: TimeSignatureDenominator;
};
export function complexityPatterns(timesig: TimeSignature): ComplexityPattern[] {
    switch (timesig.denominator) {
        case 4:
            return ["S".repeat(timesig.numerator)] as ComplexityPattern[];
        case 8:
            var results: ComplexityPattern[] = [];
            for (const twoThree of twosAndThreesSummingToN(timesig.numerator)) {
                const pattern = Array.from({ length: twoThree.twos }, () => "S").concat(Array.from({ length: twoThree.threes }, () => "C"));
                let permutations = distinguishablePermutations(pattern);
                results.push(...permutations.map(pattern => pattern.join("") as ComplexityPattern));
            }
            return results;
    }
}


export function numDivisionsPerMeasure(timesig: TimeSignature, division: Division, tuplet: Tuplet): number {
    var numDivisions;
    switch (division) {
        case "Whole":
            numDivisions = timesig.numerator / timesig.denominator;
            break;
        case "Half":
            numDivisions = 2 * timesig.numerator / timesig.denominator;
            break
        case "Quarter":
            numDivisions = 4 * timesig.numerator / timesig.denominator;
            break;
        case "Eighth":
            numDivisions = 8 * timesig.numerator / timesig.denominator;
            break;
        case "Sixteenth":
            numDivisions = 16 * timesig.numerator / timesig.denominator;
            break;
        case "ThirtySecond":
            numDivisions = 32 * timesig.numerator / timesig.denominator;
            break;
    }
    switch (tuplet) {
        case "None":
            return numDivisions;
        case "Triplet":
            return numDivisions * 3 / 2;
        case "Quintuplet":
            return numDivisions * 5 / 2;
        case "Septuplet":
            return numDivisions * 7 / 2;
        case "Nonuplet":
            return numDivisions * 9 / 2;
    }
    return numDivisions;
}

