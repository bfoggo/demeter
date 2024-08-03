import type { Note, Octave } from "./note";
import { allNotesInOctave } from "./note";
import type { TimeSignatureDenominator, ComplexityPattern, Division, Tuplet } from "./pianoRoll";
import { complexityPatterns, type TimeSignature } from "./pianoRoll";

export class MusicContext {
    numOctaves: number;
    startOctave: number;
    timeSignature: TimeSignature;
    complexityPatternStr: string;
    measures: number;
    bpm: number;
    division: Division;
    tuplet: Tuplet;
    _keys: Note[];

    constructor() {
        this.numOctaves = 2;
        this.startOctave = 4;
        this.timeSignature = { numerator: 4, denominator: 4 };
        this.complexityPatternStr = complexityPatterns(this.timeSignature)[0];
        this.measures = 2;
        this.bpm = 120;
        this.division = "Quarter";
        this.tuplet = "None";
        this._keys = Array.from({ length: this.numOctaves }, (_, i) => allNotesInOctave(this.startOctave + i as Octave),).flat();
    }

    keys(): Note[] {
        return this._keys;
    }

    reInitialiizePatternStr() {
        this.complexityPatternStr = complexityPatterns(this.timeSignature)[0];
    }
}