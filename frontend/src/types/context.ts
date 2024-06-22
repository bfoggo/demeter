import { Note } from "./note";
import { TimeSignature, TimeSignatureDenominator, Division, Tuplet, type ComplexityPattern, beatPatternStr } from "./pianoRoll";

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
        this.timeSignature = new TimeSignature(4, TimeSignatureDenominator.Quarter);
        this.complexityPatternStr = this.timeSignature.complexityPatterns()[0];
        this.measures = 2;
        this.bpm = 120;
        this.division = Division.Quarter;
        this.tuplet = Tuplet.None;
        this._keys = Array.from({ length: this.numOctaves }, (_, i) => Note.allFromOctave(this.startOctave + i),).flat();
    }

    keys(): Note[] {
        return this._keys;
    }

    reInitialiizePatternStr() {
        this.complexityPatternStr = this.timeSignature.complexityPatterns()[0];
    }
}