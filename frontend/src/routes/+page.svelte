<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { Note, pianoColor, pianoRollColor } from "../types/note";
    import { MusicContext } from "../types/context";

    import Select from "flowbite-svelte/Select.svelte";
    import Input from "flowbite-svelte/Input.svelte";
    import { readable, writable } from "svelte/store";

    import {
        PianoRollNote,
        PianoRollGrid,
        TimeSignature,
        allDivisions,
        allTuplets,
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
    $: majorLines = grid.majorLinesPosX();
    $: minorLines = grid.minorLinesPosX();
    $: measureLines = grid.measureLinesPosX();
    $: divisionLength = grid.divisionLength();

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
            for (var majorLine of majorLines) {
                let time_at_major_line = grid.posXToTime(majorLine);
                stoppables.push(kickSound(time_at_major_line, audioContext));
            }
            for (var minorLine of minorLines) {
                let time_at_minor_line = grid.posXToTime(minorLine);
                stoppables.push(highHatSound(time_at_minor_line, audioContext));
            }
            for (var midiNote of midiNotes) {
                let time_at_midi_note = grid.posXToTime(midiNote.startPosX);
                stoppables.push(
                    noteSound(
                        time_at_midi_note,
                        $musicContext.keys()[$musicContext.keys().length - midiNote.key - 1].frequency(),
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
            let closestMajorLine = majorLines.reduce((prev, curr) =>
            snapPoint > curr
                    ? curr
                    : prev,
            );
            gridEle.scrollLeft = closestMajorLine - 1;
            snapPoint = closestMajorLine - 1 + gridEle.clientWidth ;
        }
    });

</script>

<div>
    <!--Menus-->
    <div class="inline-flex ml-2 bg-gray-100 mt-2 h-10">
        <div class="flex text-sm">
            <div
                class="flex items-center hover:bg-gray-200 cursor-default pr-2"
            >
                <span class="ml-4 mr-2 text-sm">Time Signature</span>
                <Select
                    items={TimeSignature.allNumerators().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={$musicContext.timeSignature.numerator}
                    on:change={() => {
                        $musicContext.reInitialiizePatternStr()
                    }}
                    placeholder="N"
                    class="bg-gray-100 hover:bg-gray-300 py-0 w-20 border-none rounded-none text-center text-align-center hover:cursor-pointer"
                />
                <Select
                    items={TimeSignature.allDenominators().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={$musicContext.timeSignature.denominator}
                    placeholder="D"
                    class="bg-gray-100 hover:bg-gray-300 py-0 w-16 border-l-1 border-r-0 border-t-0 border-b-0 rounded-none text-center"
                    size="sm"
                    on:change={() => {
                        $musicContext.reInitialiizePatternStr()
                    }}
                />
            </div>
            <div
                class="flex items-center border-2 border-gray-200 border-r-0 border-t-0 border-b-0 hover:bg-gray-200 cursor-default pr-2"
            >
                <span class="text-sm ml-4 mr-2">Pattern</span>
                <Select
                    items={$musicContext.timeSignature.complexityPatterns().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={$musicContext.complexityPatternStr}
                    placeholder="complexity pattern"
                    class="bg-gray-100 p-0 w-40 border-none rounded-none text-center hover:bg-gray-300"
                    size="sm"
                />
            </div>
            <div
                class="flex bg-gray-100 items-center border-2 border-gray-200 border-r-0 border-t-0 border-b-0 hover:bg-gray-200 cursor-default pr-2"
            >
                <span class="text-sm ml-4 mr-2">BPM</span>
                <Input
                    bind:value={$musicContext.bpm}
                    type="number"
                    id="bpm"
                    placeholder="bpm"
                    required
                    class="bg-gray-100 hover:bg-gray-300 w-20 border-none rounded-none p-0 text-center text-sm"
                />
            </div>
            <div
                class="flex items-center border-2 border-gray-200 border-r-0 border-t-0 border-b-0 hover:bg-gray-200 cursor-default pr-2"
            >
                <span class="text-sm ml-4 mr-2">Division</span>
                <Select
                    items={allDivisions().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={$musicContext.division}
                    placeholder="division"
                    class="bg-gray-100 hover:bg-gray-300 p-0 w-32 border-none rounded-none text-center text-sm"
                    size="sm"
                />
            </div>
            <div
                class="flex items-center border-2 border-gray-200 hover:bg-gray-200 border-r-0 border-t-0 border-b-0 pr-2"
            >
                <span class="text-sm ml-4 mr-2">Tuplet</span>
                <Select
                    items={allTuplets().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={$musicContext.tuplet}
                    placeholder="tuplet"
                    class="bg-gray-100 hover:bg-gray-300 p-0 w-32 border-none rounded-none text-center text-sm"
                    size="sm"
                />
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
    </div>

    <div class="mt-1 flex ml-2 py-2">
        <!--Keyboard-->
        <div
            class="grid"
            style="grid-template-rows: repeat({$musicContext.keys().length}, {keyHeight}px); margin-right: 5px;"
        >
            {#each reverseKeys as key, keyIndex}
                <button
                    type="button"
                    class="key"
                    style="height: {keyHeight}px; width: 30px; background-color: {pianoColor(
                        key,
                    )}"
                    on:mousedown={() => playNote(key)}
                >
                </button>
            {/each}
        </div>

        <!--Grid-->
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
                {#each majorLines as posX, i}
                    <div
                        class="majorLine top-0"
                        style="position: absolute; width: 1px; height: {grid.totalHeight()}px; left: {posX}px;"
                    ></div>
                {/each}
                {#each minorLines as posX, i}
                    <div
                        class="minorLine top-0"
                        style="position: absolute; width: 1px; height: {grid.totalHeight()}px; left: {posX}px; z-index: -1;"
                    ></div>
                    {#each reverseKeys as key, keyIndex}
                        <div role="button"
                            tabindex="0"
                            class="hover:bg-gray-200"
                            style="position: absolute; left: {posX}px; top: {keyIndex *
                                keyHeight}px; height: {keyHeight}px; width: {divisionLength}px;
                            "
                            on:dblclick={() => {playNote(key); midiNotes.push({ key: keyIndex, startPosX: posX, duration: divisionLength }); midiNotes = midiNotes}}
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
                {#each measureLines as posX, i}
                    <div
                        class="measureLine top-0"
                        style="position: absolute; width: 1.5px; height: {grid.totalHeight()}px; left: {posX-1.5}px; z-index: 1;"
                    ></div>
                    <div
                        class="measureLine top-0"
                        style="position: absolute; width: 1.5px; height: {grid.totalHeight()}px; left: {posX +
                            1.5}px; z-index: 1;"
                    ></div>
                {/each}
                {#each midiNotes as midiNote}
                    <div role="button"
                        tabindex="-1"
                        class="opacity-50 hover:bg-gray-400 border-2 border-black"
                        style="background: {pianoRollColor($musicContext.keys()[midiNote.key])};
                        position: absolute; left: {midiNote.startPosX}px; top: {midiNote.key *
                            keyHeight}px; height: {keyHeight}px; width: {midiNote.duration}px;"
                            on:dblclick={() => {midiNotes = midiNotes.filter((note) => note != midiNote)}}
                    ></div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .key {
        border: 1px solid #ccc;
        cursor: pointer;
        margin: 0;
    }
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
