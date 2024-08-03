import type { Note, Octave } from "./note";
import { allNotesInOctave } from "./note";
import type { Tuplet } from "./rhythm";
import type { Division } from "./rhythm";
import type { ComplexityPattern } from "./rhythm";
import type { TimeSignatureDenominator } from "./rhythm";
import { complexityPatterns } from "./rhythm";
import { type TimeSignature } from "./rhythm";

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