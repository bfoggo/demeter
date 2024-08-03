import type { MusicContext } from "./context";
import type { Note } from "./note";
import { type Division, type TimeSignature, type Tuplet, numDivisionsPerMeasure } from "./rhythm";


export type PianoRollNote = {
    key: number;
    startPosX: number;
    startPosY: number;
    duration: number;
}


export class PianoRollGrid {
    musicContext: MusicContext;
    keyHeight: number;
    eighthNoteWidth: number;
    notes: PianoRollNote[];

    constructor(musicContext: MusicContext, keyHeight: number, eighthNoteWidth: number) {
        this.musicContext = musicContext;
        this.keyHeight = keyHeight;
        this.eighthNoteWidth = eighthNoteWidth;
        this.notes = [];
    }

    measureWidth(): number {
        switch (this.musicContext.timeSignature.denominator) {
            case 4:
                return this.musicContext.timeSignature.numerator * 2 * this.eighthNoteWidth;
            case 8:
                return this.musicContext.timeSignature.numerator * this.eighthNoteWidth;
        }
    }

    totalWidth(): number {
        switch (this.musicContext.timeSignature.denominator) {
            case 4:
                return this.musicContext.measures * this.musicContext.timeSignature.numerator * 2 * this.eighthNoteWidth;
            case 8:
                return this.musicContext.measures * this.musicContext.timeSignature.numerator * this.eighthNoteWidth;
        }
    }

    totalHeight(): number {
        return this.musicContext.keys.length * this.keyHeight;
    }

    majorLinesPosX(): number[] {
        var gridLines: number[] = [];
        let current = 0;
        for (const complexity of this.musicContext.complexityPatternStr) {
            gridLines.push(current);
            if (complexity === "S") {
                current += 2 * this.eighthNoteWidth;
            } else {
                current += 3 * this.eighthNoteWidth;
            }
        }
        gridLines.push(current);
        let gridLinesAllMeasures = Array.from({ length: this.musicContext.measures }, (_, i) => i)
            .map(i => gridLines.slice(0, gridLines.length - 1).map(l => l + i * this.measureWidth()))
            .flat();
        return gridLinesAllMeasures;
    }

    divisionLength(): number {
        let divisionLength = this.eighthNoteWidth;
        switch (this.musicContext.division) {
            case "Whole":
                divisionLength *= 8;
                break;
            case "Half":
                divisionLength *= 4;
                break;
            case "Quarter":
                divisionLength *= 2;
                break;
            case "Eighth":
                divisionLength *= 1;
                break;
            case "Sixteenth":
                divisionLength /= 2;
                break;
            case "ThirtySecond":
                divisionLength /= 4;
                break;
        }
        switch (this.musicContext.tuplet) {
            case "None":
                divisionLength *= 1;
                break;
            case "Triplet":
                divisionLength *= 2 / 3;
                break;
            case "Quintuplet":
                divisionLength *= 2 / 5;
                break;
            case "Septuplet":
                divisionLength *= 2 / 7;
                break;
            case "Nonuplet":
                divisionLength *= 2 / 9;
                break;
        }
        return divisionLength;
    }

    minorLinesPosX(): number[] {
        const gridLines = [];
        let current = 0;
        for (let i = 0; i < this.musicContext.measures * numDivisionsPerMeasure(this.musicContext.timeSignature, this.musicContext.division, this.musicContext.tuplet); i++) {
            gridLines.push(current);
            current += this.divisionLength();
        }
        return gridLines;
    }

    measureLinesPosX(): number[] {
        const timeSignature = this.musicContext.timeSignature;
        const gridLines = [];
        let current = 0;
        for (let i = 0; i < this.musicContext.measures; i++) {
            gridLines.push(current);
            current += timeSignature.denominator === 4 ? timeSignature.numerator * 2 * this.eighthNoteWidth : timeSignature.numerator * this.eighthNoteWidth;
        }
        gridLines.push(current);
        return gridLines;
    }

    posXToTime(posX: number): number {
        return posX / this.eighthNoteWidth / 2 * 60 / this.musicContext.bpm;
    }

    timeToPosX(time: number): number {
        return time / 60 * this.musicContext.bpm * (this.eighthNoteWidth * 2);
    }

    keyToPosY(key: number): number {
        return key * this.keyHeight;
    }

    posYToKey(posY: number): number {
        return Math.floor(posY / this.keyHeight);
    }

}