export type NoteName = { noteSet: "sharps", name: NoteNameSharp } | { noteSet: "flats", name: NoteNameFlat };
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export function allStartOctaves(numOctaves: number): Octave[] {
    return Array.from({length: 9 - numOctaves}, (_, i) => (i as Octave))
}
export type Note = {
    name: NoteName;
    octave: Octave;
};
export function allNotesInOctave(octave: Octave, noteSet: "sharps" | "flats" = "sharps"): Note[] {
    if (noteSet === "flats") {
        const strNames = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as NoteNameFlat[];
        return strNames.map((strName) => ({ name: { noteSet, name: strName }, octave }));
    }
    if (noteSet === "sharps") {
        const strNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as NoteNameSharp[];
        return strNames.map((strName) => ({ name: { noteSet, name: strName }, octave }));
    }
    throw new Error("Invalid note set " + noteSet);
}
export function frequency(note: Note): number {
    const a = 440;
    const n = noteNameIndex(note.name) + (note.octave) * 12;
    return Math.pow(2, (n - 57) / 12) * a;
}
export function pianoColor(note: Note) {
    if (note.name.name === "C") {
        return "yellow";
    }
    if (note.name.name === "D" || note.name.name === "E" || note.name.name === "F" || note.name.name === "G" || note.name.name === "A" || note.name.name === "B") {
        return "white";
    } else {
        return "black";
    }
}
export function pianoRollColor(notename: NoteName): HexString {
    if (asSharp.get(notename.name) === "B") {
        return "#FF0055";
    }
    if (asSharp.get(notename.name) === "C") {
        return "#AA00FF";
    }
    if (asSharp.get(notename.name) === "C#") {
        return "#0000FF";
    }
    if (asSharp.get(notename.name) === "D") {
        return "#0055FF";
    }
    if (asSharp.get(notename.name) === "D#") {
        return "#00AAFF";
    }
    if (asSharp.get(notename.name) === "E") {
        return "#00FFD4";
    }
    if (asSharp.get(notename.name) === "F") {
        return "#00FF55";
    }
    if (asSharp.get(notename.name) === "F#") {
        return "#55FF00";
    }
    if (asSharp.get(notename.name) === "G") {
        return "#AAFF00";
    }
    if (asSharp.get(notename.name) === "G#") {
        return "#FFD400";
    }
    if (asSharp.get(notename.name) === "A") {
        return "#FFAA00";
    }
    if (asSharp.get(notename.name) === "A#") {
        return "#FF5500";
    }
    throw new Error("Invalid note" + notename);

}
export type HexString = String;

type NoteNameSharp = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";
type NoteNameFlat = "C" | "Db" | "D" | "Eb" | "E" | "F" | "Gb" | "G" | "Ab" | "A" | "Bb" | "B";

const asSharp: Map<string, string> = new Map([
    ["C", "C"],
    ["Db", "C#"],
    ["D", "D"],
    ["Eb", "D#"],
    ["E", "E"],
    ["F", "F"],
    ["Gb", "F#"],
    ["G", "G"],
    ["Ab", "G#"],
    ["A", "A"],
    ["Bb", "A#"],
    ["B", "B"],
    ["C#", "C#"],
    ["D#", "D#"],
    ["F#", "F#"],
    ["G#", "G#"],
    ["A#", "A#"]

]);

const asFlat: Map<string, string> = new Map([
    ["C", "C"],
    ["C#", "Db"],
    ["D", "D"],
    ["D#", "Eb"],
    ["E", "E"],
    ["F", "F"],
    ["F#", "Gb"],
    ["G", "G"],
    ["G#", "Ab"],
    ["A", "A"],
    ["A#", "Bb"],
    ["B", "B"],
    ["Db", "Db"],
    ["Eb", "Eb"],
    ["Gb", "Gb"],
    ["Ab", "Ab"],
    ["Bb", "Bb"]
]);

const sharpToIndex: Map<NoteNameSharp, number> = new Map([
    ["C" as NoteNameSharp, 0],
    ["C#" as NoteNameSharp, 1],
    ["D" as NoteNameSharp, 2],
    ["D#" as NoteNameSharp, 3],
    ["E" as NoteNameSharp, 4],
    ["F" as NoteNameSharp, 5],
    ["F#" as NoteNameSharp, 6],
    ["G" as NoteNameSharp, 7],
    ["G#" as NoteNameSharp, 8],
    ["A" as NoteNameSharp, 9],
    ["A#" as NoteNameSharp, 10],
    ["B" as NoteNameSharp, 11]
]);
const flatToIndex: Map<NoteNameFlat, number> = new Map([
    ["C" as NoteNameFlat, 0],
    ["Db" as NoteNameFlat, 1],
    ["D" as NoteNameFlat, 2],
    ["Eb" as NoteNameFlat, 3],
    ["E" as NoteNameFlat, 4],
    ["F" as NoteNameFlat, 5],
    ["Gb" as NoteNameFlat, 6],
    ["G" as NoteNameFlat, 7],
    ["Ab" as NoteNameFlat, 8],
    ["A" as NoteNameFlat, 9],
    ["Bb" as NoteNameFlat, 10],
    ["B" as NoteNameFlat, 11]
]);

function noteNameIndex(note: NoteName): number {
    if (note.noteSet === "sharps") {
        return sharpToIndex.get(note.name) as number;
    }
    if (note.noteSet === "flats") {
        return flatToIndex.get(note.name) as number;
    }
    throw new Error("Invalid note " + note);
}

export type Chord = Note[];

type ThirdQuality = "major" | "minor" | "sus2" | "sus4";
type FifthQuality = "perfect" | "diminished" | "augmented";
type SeventhQuality = null | "major" | "minor" | "diminished" | "augmented";
type NinthQuality = null | "major" | "minor" | "diminished" | "augmented";
type EleventhQuality = null | "perfect" | "augmented";
type ThirteenthQuality = null | "major" | "minor" | "diminished" | "augmented";

type ChordGrammar = {
    root: NoteName;
}

export function parseChord(chord: string, asNoteSet: "sharps" | "flats"): ChordGrammar {
    const root = chord[0].toUpperCase() 
    const quality = (chord[1] === "#" || chord[1] === "b" ? chord[1] : "")
    const full = root + quality
    switch (asNoteSet) {
        case "sharps":
            return {root: { noteSet: asNoteSet, name: asSharp.get(full) as NoteNameSharp }} as ChordGrammar;
        case "flats":
            return {root: { noteSet: asNoteSet, name: asFlat.get(full) as NoteNameFlat }} as ChordGrammar;
    }
}