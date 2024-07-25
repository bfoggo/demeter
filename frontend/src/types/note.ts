
export enum NoteName {
    C = 0,
    CSharp = 1,
    D = 2,
    DSharp = 3,
    E = 4,
    F = 5,
    FSharp = 6,
    G = 7,
    GSharp = 8,
    A = 9,
    ASharp = 10,
    B = 11
}

export class Note {
    name: NoteName;
    octave: number;

    constructor(name: NoteName, octave: number) {
        this.name = name;
        this.octave = octave;
    }

    fullName() {
        return this.name + this.octave;
    }

    frequency() {
        const a = 440;
        const n = this.name.valueOf() + (this.octave) * 12;
        return Math.pow(2, (n - 57) / 12) * a;
    }

    static allFromOctave(octave: number) {
        const orderedNotes = [
            NoteName.C,
            NoteName.CSharp,
            NoteName.D,
            NoteName.DSharp,
            NoteName.E,
            NoteName.F,
            NoteName.FSharp,
            NoteName.G,
            NoteName.GSharp,
            NoteName.A,
            NoteName.ASharp,
            NoteName.B
        ];
        return orderedNotes.map(name => new Note(name, octave));
    }
}

export type Chord = Note[];

type ThirdQuality = "major" | "minor" | "sus2" | "sus4";
type FifthQuality = "perfect" | "diminished" | "augmented";
type SeventhQuality = null | "major" | "minor" | "diminished" | "augmented";
type NinthQuality = null | "major" | "minor" | "diminished" | "augmented";
type EleventhQuality = null | "perfect" | "augmented";
type ThirteenthQuality = null | "major" | "minor" | "diminished" | "augmented";

class ChordGrammar {
    root: NoteName;
    third: ThirdQuality;
    fifth: FifthQuality;
    seventh: SeventhQuality;
    ninth: NinthQuality;
    eleventh: EleventhQuality;
    thirteenth: ThirteenthQuality;

    constructor(root: NoteName, third: ThirdQuality, fifth: FifthQuality, seventh: SeventhQuality, ninth: NinthQuality, eleventh: EleventhQuality, thirteenth: ThirteenthQuality) {
        this.root = root;
        this.third = third;
        this.fifth = fifth;
        this.seventh = seventh;
        this.ninth = ninth;
        this.eleventh = eleventh;
        this.thirteenth = thirteenth;
    }
}

export function pianoColor(note: Note) {
    if (note.name === NoteName.C){
        return "yellow";
    }
    if (note.name === NoteName.D || note.name === NoteName.E || note.name === NoteName.F || note.name === NoteName.G || note.name === NoteName.A || note.name === NoteName.B) {
        return "white";
    } else {
        return "black";
    }
}

export function pianoRollColor(notename: NoteName): HexString {
    if (notename === NoteName.B){
        return "#FF0055";
    }
    if (notename === NoteName.C){
        return "#AA00FF";
    }
    if (notename === NoteName.CSharp){
        return "#0000FF";
    }
    if (notename === NoteName.D){
        return "#0055FF";
    }
    if (notename === NoteName.DSharp){
        return "#00AAFF";
    }
    if (notename === NoteName.E){
        return "#00FFD4";
    }
    if (notename === NoteName.F){
        return "#00FF55";
    }
    if (notename === NoteName.FSharp){
        return "#55FF00";
    }
    if (notename === NoteName.G){
        return "#AAFF00";
    }
    if (notename === NoteName.GSharp){
        return "#FFD400";
    }
    if (notename === NoteName.A){
        return "#FFAA00";
    }
    if (notename === NoteName.ASharp){
        return "#FF5500";
    }
    throw new Error("Invalid note" + notename);
}
export type HexString = String;
