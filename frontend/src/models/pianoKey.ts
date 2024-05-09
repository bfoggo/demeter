class Note {
    num: number;
    octave: number;

    constructor(num: number, octave: number) {
        this.num = num;
        this.octave = octave;
    }

    name() {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return noteNames[this.num];
    }

    fullName() {
        return this.name() + this.octave;
    }

    frequency(tempermant = 'equal') {
        return frequency(this, getTempermant(tempermant));
    }
  
}

enum Tempermant {
    Equal = 'equal',
}

function getTempermant(tempermant: string): Tempermant {
    switch (tempermant) {
        case 'equal':
            return Tempermant.Equal;
        default:
            return Tempermant.Equal;
    }

}

function frequency(note: Note, tempermant: Tempermant): number {
    const a = 440;
    const n = note.num + 12 * (note.octave - 4);
    switch (tempermant) {
        case Tempermant.Equal:
            return Math.pow(2, (n - 49) / 12) * a;
    }
}