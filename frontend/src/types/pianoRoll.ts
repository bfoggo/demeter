import type { Note } from "./note";

export enum TimeSignatureDenominator {
    Quarter = 4,
    Eighth = 8,
}

export enum BeatComplexity {
    Simple,
    Compound,
}

class TwosAndThrees {
    twos: number;
    threes: number;

    constructor(twos: number, threes: number) {
        this.twos = twos;
        this.threes = threes;
    }

    permutations(): number[][] {
        if (this.twos === 0 && this.threes === 0) {
            return [];
        }
        if (this.twos === 0) {
            return Array.from({ length: this.threes }, () => [3]);
        }
        if (this.threes === 0) {
            return Array.from({ length: this.twos }, () => [2]);
        }
        var elements = Array.from({ length: this.twos + this.threes }, (_, i) => i < this.twos ? 2 : 3);
        var results = [];
        for (let i = 0; i < this.twos + this.threes; i++) {
            var subElements = elements.slice();
            subElements.splice(i, 1);
            var subTwoThree
            if (elements[i] === 2) {
                subTwoThree = new TwosAndThrees(this.twos - 1, this.threes);
            } else {
                subTwoThree = new TwosAndThrees(this.twos, this.threes - 1);
            }
            var subPermutations = subTwoThree.permutations();
            for (let j = 0; j < subPermutations.length; j++) {
                for (let k = 0; k < subPermutations[j].length; k++) {
                    var newResult = subPermutations[j].splice(k, 0, elements[i]);
                    results.push(newResult);
                }
            }
        }
        return results;
    }
}

function numberOfTwosAndThrees(n: number): { twos: number, threes: number }[] {
    // all (x, y) such that 2x + 3y = n
    if (n < 2) {
        throw new Error("n must be greater than 2");
    }
    if (n === 2) {
        return [{ twos: 1, threes: 0 }];
    }
    if (n === 3) {
        return [{ twos: 0, threes: 1 }];
    }
    const results = [];
    for (let i = 0; i <= Math.floor(n / 2); i++) {
        if ((n - 2 * i) % 3 === 0) {
            results.push({ twos: i, threes: (n - 2 * i) / 3 });
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

    complexityPatters(): BeatComplexity[][] {
        switch (this.denominator) {
            case TimeSignatureDenominator.Quarter:
                return [Array.from({ length: this.numerator }, () => BeatComplexity.Simple)];
            case TimeSignatureDenominator.Eighth:
            // all of the ways to sum 2 and 3 to get this.numerator

            default:
                throw new Error("Invalid time signature denominator");
        }

    }

}

export class PianoRollGrid {
    measures: number;
    timeSignature: TimeSignature;
    division: number;
    height: number;

    constructor(height: number) {
        this.measures = 4;
        this.division = 4;
        this.timeSignature = new TimeSignature(4, TimeSignatureDenominator.Quarter);
        this.height = height;
    }

    get fullWidth() {
        return this.measures * this.division;
    }

}