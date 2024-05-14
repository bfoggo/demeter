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

export function pianoColor(note: Note) {
    if (note.name === NoteName.C || note.name === NoteName.D || note.name === NoteName.E || note.name === NoteName.F || note.name === NoteName.G || note.name === NoteName.A || note.name === NoteName.B) {
        return "white";
    } else {
        return "black";
    }
}