<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { Note, pianoRollColor } from "../types/note";
    import { MusicContext } from "../types/context";
    import Keyboard from "../components/keyboard.svelte";
    import { writable } from "svelte/store";
    import MusicSettings from "../components/musicsettings.svelte";
    import {
        PianoRollNote,
        PianoRollGrid,
    } from "../types/pianoRoll";
    import { PlaybackTimer } from "../types/playback";
    import { kickSound, highHatSound, noteSound } from "../types/sounds";
    import type { Stoppable } from "../types/sounds";

    var audioContext: AudioContext;
    onMount(() => {
        audioContext = new AudioContext();
    });
    let musicContext = writable(new MusicContext());
    let timer = writable(new PlaybackTimer());

    const keyHeight = 20;
    const eighthNoteWidth = 80;

    $: grid = new PianoRollGrid($musicContext, keyHeight, eighthNoteWidth);
    $: reverseKeys = $musicContext.keys().slice().reverse();

    var midiNotes: PianoRollNote[] = [];

    function playNote(note: Note) {
        noteSound(0.0, note.frequency(), audioContext);
    }

    function startTimer() {
        timer.update((t) => {
            t.start();
            return t;
        });
    }
    function stopTimer() {
        timer.update((t) => {
            t.stop();
            return t;
        });
    }

    $: if ($musicContext) {
        stopTimer();
    }

    var timerIntervalid: number | null;
    var stoppables: Stoppable[] = [];
    var elapsedTime: number = 0;
    var timerPosX: number = 0;
    timer.subscribe((t) => {
        if (t.playing) {
            stoppables = [];
            for (var majorLine of grid.majorLinesPosX()) {
                let time_at_major_line = grid.posXToTime(majorLine);
                stoppables.push(kickSound(time_at_major_line, audioContext));
            }
            for (var minorLine of grid.minorLinesPosX()) {
                let time_at_minor_line = grid.posXToTime(minorLine);
                stoppables.push(highHatSound(time_at_minor_line, audioContext));
            }
            for (var midiNote of midiNotes) {
                let time_at_midi_note = grid.posXToTime(midiNote.startPosX);
                stoppables.push(
                    noteSound(
                        time_at_midi_note,
                        $musicContext
                            .keys()
                            [
                                $musicContext.keys().length - midiNote.key - 1
                            ].frequency(),
                        audioContext,
                    ),
                );
            }
            timerIntervalid = setInterval(() => {
                elapsedTime = t.getElapsedTime() / 1000;
                timerPosX = grid.timeToPosX(elapsedTime);
                if (timerPosX > grid.totalWidth()) {
                    stopTimer();
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

    var gridEle: HTMLElement;
    var snapPoint: number;
    onMount(() => {
        snapPoint = gridEle.clientWidth;
    });

    afterUpdate(() => {
        if (timerPosX == 0) {
            gridEle.scrollLeft = 0;
            snapPoint = gridEle.clientWidth;
            return;
        }
        if (timerPosX > snapPoint) {
            let closestMajorLine = grid.majorLinesPosX().reduce((prev, curr) =>
                snapPoint > curr ? curr : prev,
            );
            gridEle.scrollLeft = closestMajorLine - 1;
            snapPoint = closestMajorLine - 1 + gridEle.clientWidth;
        }
    });
</script>

<div class="divide-y-2">
    <MusicSettings {musicContext} />

    <div class="mt-1 flex ml-2 py-2">
        <Keyboard
            keys={$musicContext.keys()}
            {keyHeight}
            width={30}
            {playNote}
            noteColors={pianoRollColor}
        />
        <div
            class="w-full overflow-auto scroll-smooth pb-4 z-0"
            bind:this={gridEle}
        >
            <div
                class="z-1"
                style="position: relative; height: {grid.totalHeight()}px; width: {grid.totalWidth()}px;"
            >
                <div
                    class="bg-violet-300 opacity-30 h-full w-2 absolute top-0 left-0"
                    style="width: {timerPosX}px; z-index: 1;"
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
                                keyHeight}px; height: {keyHeight}px; width: {grid.divisionLength()}px;
                            "
                            on:dblclick={() => {
                                playNote(key);
                                midiNotes.push({
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
                            keyHeight}px; z-index: -1;"
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
                {#each midiNotes as midiNote}
                    <div
                        role="button"
                        tabindex="-1"
                        class="opacity-50 hover:bg-gray-400 border-2 border-black"
                        style="background: {pianoRollColor(
                            $musicContext.keys()[midiNote.key],
                        )};
                        position: absolute; left: {midiNote.startPosX}px; top: {midiNote.key *
                            keyHeight}px; height: {keyHeight}px; width: {midiNote.duration}px;"
                        on:dblclick={() => {
                            midiNotes = midiNotes.filter(
                                (note) => note != midiNote,
                            );
                        }}
                    ></div>
                {/each}
            </div>
        </div>
    </div>
</div>
<button
    type="button"
    class="flex items-center jusitfy-center border-2 border-gray-200 hover:bg-gray-200 border-r-0 border-t-0 border-b-0 px-2"
    on:click={() => {
        stopTimer();
        startTimer();
    }}
>
    <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
    >
        <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 16.881V7.119a1 1 0 0 1 1.636-.772l5.927 4.881a1 1 0 0 1 0 1.544l-5.927 4.88A1 1 0 0 1 8 16.882Z"
        />
    </svg>
</button>

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
