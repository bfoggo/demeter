<script context="module" lang="ts">
    export type PianoRollNote = {
        key: number;
        startPosX: number;
        startPosY: number;
        duration: number;
    };

    export type PianoRollGrid = {
        keyHeight: number;
        eighthNoteWidth: number;
    };
</script>

<script lang="ts">
    import type { PlaybackTimer } from "../types/playback";
    import type { Note } from "../types/note";
    import MidiNotesView from "./midinotesview.svelte";
    import { frequency, pianoRollColor } from "../types/note";
    import type { MusicContext } from "../components/musicsettings.svelte";
    import { numDivisionsPerMeasure } from "../types/rhythm";
    import type { Stoppable } from "../types/sounds";
    import { kickSound, snareSound, noteBlipSound } from "../types/sounds";

    let {
        audioContext,
        musicContext,
        grid,
        playbackTimer,
        playClickedNote,
    }: {
        audioContext: AudioContext;
        musicContext: MusicContext;
        grid: PianoRollGrid;
        playbackTimer: PlaybackTimer;
        playClickedNote: (note: Note) => void;
    } = $props();

    let measureWidth = $derived.by(() => {
        switch (musicContext.timeSignature.denominator) {
            case 4:
                return (
                    musicContext.timeSignature.numerator *
                    2 *
                    grid.eighthNoteWidth
                );
            case 8:
                return (
                    musicContext.timeSignature.numerator * grid.eighthNoteWidth
                );
        }
    });

    let totalWidth = $derived.by(() => {
        switch (musicContext.timeSignature.denominator) {
            case 4:
                return (
                    musicContext.measures *
                    musicContext.timeSignature.numerator *
                    2 *
                    grid.eighthNoteWidth
                );
            case 8:
                return (
                    musicContext.measures *
                    musicContext.timeSignature.numerator *
                    grid.eighthNoteWidth
                );
        }
    });

    let totalHeight = $derived(musicContext.keys.length * grid.keyHeight);
    let majorLinesPosX = $derived.by(() => {
        var gridLines: number[] = [];
        let current = 0;
        for (const complexity of musicContext.complexityPattern) {
            gridLines.push(current);
            if (complexity === "S") {
                current += 2 * grid.eighthNoteWidth;
            } else {
                current += 3 * grid.eighthNoteWidth;
            }
        }
        gridLines.push(current);
        let gridLinesAllMeasures = Array.from(
            { length: musicContext.measures },
            (_, i) => i,
        )
            .map((i) =>
                gridLines
                    .slice(0, gridLines.length - 1)
                    .map((l) => l + i * measureWidth),
            )
            .flat();
        return gridLinesAllMeasures;
    });

    let divisionLength = $derived.by(() => {
        let divisionLength = grid.eighthNoteWidth;
        switch (musicContext.division) {
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
        switch (musicContext.tuplet) {
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
    });

    let minorLinesPosX = $derived.by(() => {
        const gridLines = [];
        let current = 0;
        for (
            let i = 0;
            i <
            musicContext.measures *
                numDivisionsPerMeasure(
                    musicContext.timeSignature,
                    musicContext.division,
                    musicContext.tuplet,
                );
            i++
        ) {
            gridLines.push(current);
            current += divisionLength;
        }
        return gridLines;
    });

    let measureLinesPosX = $derived.by(() => {
        const timeSignature = musicContext.timeSignature;
        const gridLines = [];
        let current = 0;
        for (let i = 0; i < musicContext.measures; i++) {
            gridLines.push(current);
            current +=
                timeSignature.denominator === 4
                    ? timeSignature.numerator * 2 * grid.eighthNoteWidth
                    : timeSignature.numerator * grid.eighthNoteWidth;
        }
        gridLines.push(current);
        return gridLines;
    });

    function posXToTime(posX: number): number {
        return ((posX / grid.eighthNoteWidth / 2) * 60) / musicContext.bpm;
    }

    function timeToPosX(time: number): number {
        return (time / 60) * musicContext.bpm * (grid.eighthNoteWidth * 2);
    }

    function keyToPosY(key: number): number {
        return key * grid.keyHeight;
    }

    function posYToKey(posY: number): number {
        return Math.floor(posY / grid.keyHeight);
    }

    function minorLineAt(posX: number): number {
        if (posX < 0) {
            return 0;
        }
        let left = Math.floor(posX / divisionLength);
        let right = Math.ceil(posX / divisionLength);
        if (left === right) {
            return left;
        }
        if (
            Math.abs(left * divisionLength - posX) <
            Math.abs(right * divisionLength - posX)
        ) {
            return left;
        }
        return right;
    }
    function keyAt(posY: number): number {
        if (posY < 0) {
            return 0;
        }
        let above = Math.floor(posY / grid.keyHeight);
        let below = Math.ceil(posY / grid.keyHeight);
        if (above === below) {
            return above;
        }
        if (
            Math.abs(above * grid.keyHeight - posY) <
            Math.abs(below * grid.keyHeight - posY)
        ) {
            return above;
        }
        return below;
    }

    var gridEle: HTMLElement;
    var snapPoint: number;
    $effect(() => {
        snapPoint = gridEle.clientWidth;
    });

    let timerX: number = $state(0);
    var elapsedTime;
    var timerIntervalid: number | null;
    var stoppables: Stoppable[] = [];
    var timerPosX: number = 0;
    setInterval(() => {
        elapsedTime = playbackTimer.getElapsedSeconds();
        timerX = timeToPosX(elapsedTime);
    }, 10);

    $effect(() => {
        if (!playbackTimer.playing) {
            gridEle.scrollLeft = 0;
            snapPoint = gridEle.clientWidth;
            return;
        }
        if (timerX > snapPoint) {
            let closestMajorLine = majorLinesPosX.reduce((prev, curr) =>
                snapPoint > curr ? curr : prev,
            );
            gridEle.scrollLeft = closestMajorLine - 1;
            snapPoint = closestMajorLine - 1 + gridEle.clientWidth;
        }
    });

    let midiNotes = $state(new Set<PianoRollNote>());
    var currentMidiNote: HTMLElement | undefined;

    $effect(() => {
        if (playbackTimer.playing) {
            stoppables = [];
            for (var majorLine of majorLinesPosX) {
                let time_at_major_line = posXToTime(majorLine);
                stoppables.push(kickSound(time_at_major_line, audioContext));
            }
            for (var minorLine of minorLinesPosX) {
                let time_at_minor_line = posXToTime(minorLine);
                stoppables.push(snareSound(time_at_minor_line, audioContext));
            }
            for (var midiNote of midiNotes) {
                let time_at_midi_note = posXToTime(midiNote.startPosX);
                stoppables.push(
                    noteBlipSound(
                        time_at_midi_note,
                        frequency(
                            musicContext.keys[
                                musicContext.keys.length - midiNote.key - 1
                            ],
                        ),
                        audioContext,
                    ),
                );
            }
            timerIntervalid = setInterval(() => {
                elapsedTime = playbackTimer.getElapsedSeconds();
                timerPosX = timeToPosX(elapsedTime);
                if (timerPosX > totalWidth) {
                    playbackTimer.stop();
                }
            }, 10);
        } else {
            timerPosX = 0;
            if (timerIntervalid) {
                clearInterval(timerIntervalid);
            }
            for (var stoppable of stoppables) {
                stoppable.stop();
            }
        }
    });

    let reverseKeys = $derived.by(() => musicContext.keys.slice().reverse());
    var dragStartX: number;
    var dragStartY: number;
</script>

<div class="overflow-auto scroll-smooth pb-4 z-0" bind:this={gridEle}>
    <div
        class="z-1"
        style="position: relative; height: {totalHeight}px; width: {totalWidth}px;"
    >
        <div
            class="bg-violet-300 opacity-30 h-full w-2 absolute top-0 left-0"
            style="width: {timerX}px; z-index: 1;"
        ></div>
        {#each majorLinesPosX as posX, i}
            <div
                class="majorLine top-0"
                style="position: absolute; width: 1px; height: {totalHeight}px; left: {posX}px;"
            ></div>
        {/each}
        {#each minorLinesPosX as posX, i}
            <div
                class="minorLine top-0"
                style="position: absolute; width: 1px; height: {totalHeight}px; left: {posX}px; z-index: -1;"
            ></div>
            {#each reverseKeys as key, keyIndex}
                <div
                    role="button"
                    draggable="false"
                    tabindex="0"
                    class="hover:bg-gray-200"
                    style="position: absolute; left: {posX}px; top: {keyIndex *
                        grid.keyHeight}px; height: {grid.keyHeight}px; width: {divisionLength}px;
                            "
                    ondblclick={() => {
                        playClickedNote(key);
                        midiNotes.add({
                            key: keyIndex,
                            startPosX: posX,
                            startPosY: keyIndex * grid.keyHeight,
                            duration: divisionLength,
                        });
                        midiNotes = midiNotes;
                    }}
                    ondragover={(e) => {
                        e.preventDefault();
                        if (e.target instanceof HTMLElement) {
                            e.target.style.backgroundColor = "#E5E7EB";
                            playClickedNote(reverseKeys[keyIndex]);
                        }
                    }}
                    ondragleave={(e) => {
                        if (e.target instanceof HTMLElement) {
                            e.target.style.backgroundColor = "";
                        }
                    }}
                    ondrop={(e) => {
                        e.preventDefault();
                        if (e.target instanceof HTMLElement) {
                            e.target.style.backgroundColor = "";
                        }
                    }}
                ></div>
            {/each}
        {/each}
        {#each reverseKeys as key, keyIndex}
            <div
                class="minorLine"
                style="position: absolute; width: {totalWidth}px; height: 1px; top: {keyIndex *
                    grid.keyHeight}px; z-index: -1;"
            ></div>
        {/each}
        <div
            class="minorLine"
            style="position: absolute; width: {totalWidth}px; height: 1px; top: {totalHeight}px; z-index: -1;"
        ></div>
        {#each measureLinesPosX as posX, i}
            <div
                class="measureLine top-0"
                style="position: absolute; width: 1.5px; height: {totalHeight}px; left: {posX -
                    1.5}px; z-index: 1;"
            ></div>
            <div
                class="measureLine top-0"
                style="position: absolute; width: 1.5px; height: {totalHeight}px; left: {posX +
                    1.5}px; z-index: 1;"
            ></div>
        {/each}
        <div>
            {#each midiNotes as midiNote}
                <div
                    bind:this={currentMidiNote}
                    draggable="true"
                    role="button"
                    tabindex="-1"
                    class="opacity-50 hover:bg-gray-400 border-2 border-black z-2"
                    style="background: {pianoRollColor(
                        reverseKeys[midiNote.key].name,
                    )};
                                position: absolute; left: {midiNote.startPosX}px; top: {midiNote.key *
                        grid.keyHeight}px; height: {grid.keyHeight}px; width: {midiNote.duration}px;"
                    ondblclick={() => {
                        midiNotes.delete(midiNote);
                        midiNotes = midiNotes;
                    }}
                    onclick={() => {
                        playClickedNote(reverseKeys[midiNote.key]);
                    }}
                    onkeydown={(e) => {
                        if (e.key === "Delete") {
                            midiNotes.delete(midiNote);
                            midiNotes = midiNotes;
                        }
                    }}
                    ondragstart={(e) => {
                        dragStartX = e.clientX;
                        dragStartY = e.clientY;
                        if (e.target instanceof HTMLElement) {
                            currentMidiNote = e.target;
                            currentMidiNote.style.backgroundColor = "#E5E7EB";
                        }
                    }}
                    ondragover={(e) => {
                        e.preventDefault();
                    }}
                    ondragend={(e) => {
                        e.preventDefault();
                        let deltaX = e.clientX - dragStartX;
                        let deltaY = e.clientY - dragStartY;
                        let leftLine = minorLineAt(midiNote.startPosX + deltaX);
                        let key = keyAt(midiNote.startPosY + deltaY);
                        midiNote.startPosX = leftLine * divisionLength;
                        midiNote.key = key;
                        midiNote.startPosY = key * grid.keyHeight;
                        midiNotes = midiNotes;
                        dragStartX = 0;
                        dragStartY = 0;
                        playClickedNote(reverseKeys[key]);
                    }}
                ></div>
            {/each}
        </div>
    </div>
</div>

<style>
    .measureLine {
        background-color: #000000;
    }
    .majorLine {
        border-left-style: dashed;
        border-right: none;
        border-width: 2px;
        border-color: #000000;
    }
    .minorLine {
        background-color: #a8a8a8;
    }
</style>
