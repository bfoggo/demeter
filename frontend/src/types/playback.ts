import { TimeSignature, TimeSignatureDenominator } from "./pianoRoll";


export class PlaybackTimer {
    startTime: Date;
    playing: boolean = false;

    constructor() {
        this.startTime = new Date();
    }

    start() {
        this.startTime = new Date();
        this.playing = true;
    }

    stop() {
        this.playing = false;
    }

    getElapsedTime() {
        if (this.playing) {
            return new Date().getTime() - this.startTime.getTime();
        }
        return 0;
    }

    totalSeconds(timeSignature: TimeSignature, bpm: number, measures: number) {
        if (timeSignature.denominator == TimeSignatureDenominator.Quarter) {
            return measures * timeSignature.numerator / bpm * 60;
        } else {
            return measures * timeSignature.numerator / bpm * 60 / 2;
        }
    }
}