export class Note {
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

    frequency() {
        const a = 440;
        const n = this.num + 12 * (this.octave);
        return Math.pow(2, (n - 57) / 12) * a;
    }

    pianoColor() {
        const blackNotes = [1, 3, 6, 8, 10];
        return blackNotes.includes(this.num) ? 'black' : 'white';
    }
  
}