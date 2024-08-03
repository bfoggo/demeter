<script lang="ts">
    import { onMount } from "svelte";
    import type { PianoRollGrid, PianoRollNote } from "../types/pianoRoll";
    import type { PlaybackTimer } from "../types/playback";
    import type { HexString, Note } from "../types/note";
    import type { Writable } from "svelte/store";
    import MidiNotesView from "./midinotesview.svelte";
    import { pianoRollColor } from "../types/note";

    let {
        grid,
        playbackTimer,
        reverseKeys,
        playNote,
        midiNotes,
    }: {
        grid: PianoRollGrid;
        playbackTimer: PlaybackTimer;
        reverseKeys: Note[];
        playNote: (note: Note) => void;
        midiNotes: Set<PianoRollNote>;
    } = $props();

    var gridEle: HTMLElement;
    var snapPoint: number;
    onMount(() => {
        snapPoint = gridEle.clientWidth;
    });

    let timerX: number = $state(0);
    var elapsedTime;
    setInterval(() => {
        elapsedTime = playbackTimer.getElapsedSeconds();
        timerX = grid.timeToPosX(elapsedTime);
    });

    $effect(() => {
        if (!playbackTimer.playing) {
            gridEle.scrollLeft = 0;
            snapPoint = gridEle.clientWidth;
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

<div class="overflow-auto scroll-smooth pb-4 z-0" bind:this={gridEle}>
    <div
        class="z-1"
        style="position: relative; height: {grid.totalHeight()}px; width: {grid.totalWidth()}px;"
    >
        <div
            class="bg-violet-300 opacity-30 h-full w-2 absolute top-0 left-0"
            style="width: {timerX}px; z-index: 1;"
        ></div>
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
                    draggable="false"
                    tabindex="0"
                    class="hover:bg-gray-200"
                    style="position: absolute; left: {posX}px; top: {keyIndex *
                        grid.keyHeight}px; height: {grid.keyHeight}px; width: {grid.divisionLength()}px;
                            "
                    ondblclick={() => {
                        playNote(key);
                        midiNotes.add({
                            key: keyIndex,
                            startPosX: posX,
                            startPosY: keyIndex * grid.keyHeight,
                            duration: grid.divisionLength(),
                        });
                        midiNotes = midiNotes;
                    }}
                    ondragover={(e) => {
                        e.preventDefault();
                        if (e.target instanceof HTMLElement) {
                            e.target.style.backgroundColor = "#E5E7EB";
                            playNote(reverseKeys[keyIndex]);
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
                >
                </div>
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
