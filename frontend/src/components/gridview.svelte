<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import type { PianoRollGrid, PianoRollNote } from "../types/pianoRoll";
    import type { PlaybackTimer } from "../types/playback";
    import type { HexString, Note } from "../types/note";
    import type { Writable } from "svelte/store";
    import MidiNotesView from "./midinotesview.svelte";
    import { pianoRollColor } from "../types/note";

    export let grid: PianoRollGrid;
    export let playbackTimer: Writable<PlaybackTimer>;
    export let reverseKeys: Note[];
    export let playNote: (note: Note) => void;
    export let midiNotes: Writable<Set<PianoRollNote>>;

    var gridEle: HTMLElement;
    var snapPoint: number;

    onMount(() => {
        snapPoint = gridEle.clientWidth;
        playbackTimer.subscribe((t) => {
            if (!t.playing) {
                gridEle.scrollLeft = 0;
                snapPoint = gridEle.clientWidth;
                return;
            }
        });
    });

    let elapsedTime: number = 0;
    let timerX: number = 0;

    let gridUpdateIntervalid = setInterval(() => {
        elapsedTime = $playbackTimer.getElapsedSeconds();
        timerX = grid.timeToPosX(elapsedTime);
    });

    afterUpdate(() => {
        if (!$playbackTimer.playing) {
            return;
        }
        if (timerX > snapPoint) {
            let closestMajorLine = grid
                .majorLinesPosX()
                .reduce((prev, curr) => (snapPoint > curr ? curr : prev));
            gridEle.scrollLeft = closestMajorLine - 1;
            snapPoint = closestMajorLine - 1 + gridEle.clientWidth;
        }
    });
</script>

<div class="w-full overflow-auto scroll-smooth pb-4 z-0" bind:this={gridEle}>
    <div
        class="z-1"
        style="position: relative; height: {grid.totalHeight()}px; width: {grid.totalWidth()}px;"
    >
        <div
            class="bg-violet-300 opacity-30 h-full w-2 absolute top-0 left-0"
            style="width: {timerX}px; z-index: 1;"
        />
        {#each grid.majorLinesPosX() as posX, i}
            <div
                class="majorLine top-0"
                style="position: absolute; width: 1px; height: {grid.totalHeight()}px; left: {posX}px;"
            ></div>
        {/each}
        {#each grid.minorLinesPosX() as posX, i}
            <div
                class="minorLine top-0"
                style="position: absolute; width: 1px; height: {grid.totalHeight()}px; left: {posX}px; z-index: -1;"
            ></div>
            {#each reverseKeys as key, keyIndex}
                <div
                    role="button"
                    tabindex="0"
                    class="hover:bg-gray-200"
                    style="position: absolute; left: {posX}px; top: {keyIndex *
                        grid.keyHeight}px; height: {grid.keyHeight}px; width: {grid.divisionLength()}px;
                            "
                    on:dblclick={() => {
                        playNote(key);
                        $midiNotes.add({
                            key: keyIndex,
                            startPosX: posX,
                            duration: grid.divisionLength(),
                        });
                        midiNotes = midiNotes;
                    }}
                />
            {/each}
        {/each}
        {#each reverseKeys as key, keyIndex}
            <div
                class="minorLine"
                style="position: absolute; width: {grid.totalWidth()}px; height: 1px; top: {keyIndex *
                    grid.keyHeight}px; z-index: -1;"
            ></div>
        {/each}
        <div
            class="minorLine"
            style="position: absolute; width: {grid.totalWidth()}px; height: 1px; top: {grid.totalHeight()}px; z-index: -1;"
        ></div>
        {#each grid.measureLinesPosX() as posX, i}
            <div
                class="measureLine top-0"
                style="position: absolute; width: 1.5px; height: {grid.totalHeight()}px; left: {posX -
                    1.5}px; z-index: 1;"
            ></div>
            <div
                class="measureLine top-0"
                style="position: absolute; width: 1.5px; height: {grid.totalHeight()}px; left: {posX +
                    1.5}px; z-index: 1;"
            ></div>
        {/each}
        <MidiNotesView
            {pianoRollColor}
            {midiNotes}
            {grid}
            {reverseKeys}
            {playNote}
        />
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
