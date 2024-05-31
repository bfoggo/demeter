<script lang="ts">
    import { onMount } from "svelte";
    import { Note, pianoColor } from "../types/note";

    import Select from "flowbite-svelte/Select.svelte";
    import Input from "flowbite-svelte/Input.svelte";
    import { writable } from "svelte/store";

    import {
        PianoRollGrid,
        TimeSignature,
        parseBeatPatternString,
        beatPatternStr,
        Division,
        allDivisions,
        Tuplet,
        allTuplets,
    } from "../types/pianoRoll";
    import { PlaybackTimer } from "../types/playback";
    const numOctaves = 2;
    const startOctave = 4;
    const keyHeight = 20;
    const keys = Array.from({ length: numOctaves }, (_, i) =>
        Note.allFromOctave(startOctave + i),
    ).flat();
    let grid = new PianoRollGrid(2, keys.length, keyHeight, 80);

    let timeSignatureNumerator = 4;
    let timeSignatureDenominator = 4;
    let division = Division.Quarter;
    let tuplet = Tuplet.None;
    let timer = writable(new PlaybackTimer());
    var elapsedTime: number;
    var timerPosX: number;

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

    var timerIntervalid: number | null;
    timer.subscribe((t) => {
        if (t.playing) {
            timerIntervalid = setInterval(() => {
                elapsedTime = t.getElapsedTime()  / 1000;
                timerPosX = grid.timeToPosX(elapsedTime, bpm);
                if (timerPosX > grid.totalWidth(timeSignature)) {
                    stopTimer();
                }
            }, 10);
        } else {
            timerPosX = 0;
            if (timerIntervalid){ clearInterval(timerIntervalid); }
        }
        }
    );


    timer.subscribe;
    let bpm = 120;
    $: timeSignature = new TimeSignature(
        timeSignatureNumerator,
        timeSignatureDenominator,
    );
    $: complexityPatterns = timeSignature
        .complexityPatterns()
        .map(beatPatternStr);
    $: defaultBeatPattern = complexityPatterns[0];
    $: complexityPattern = defaultBeatPattern;
    $: majorLines = grid.majorLinesPosX(
        timeSignature,
        parseBeatPatternString(complexityPattern),
    );
    $: minorLines = grid.minorLinesPosX(timeSignature, division, tuplet);
    $: measureLines = grid.measureLinesPosX(timeSignature);
    $: divisionLength = grid.divisionLength(division, tuplet);

    var audioContext: AudioContext;
    onMount(() => {
        audioContext = new AudioContext();
    });

    let reverseKeys = keys.slice().reverse();
    let numKeys = keys.length;

    function playNote(note: Note) {
        let oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = note.frequency();
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
</script>

<div>
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
                    bind:value={timeSignatureNumerator}
                    placeholder="N"
                    class="bg-gray-100 hover:bg-gray-300 py-0 w-16 border-none rounded-none text-center text-align-center hover:cursor-pointer"
                />
                <Select
                    items={TimeSignature.allDenominators().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={timeSignatureDenominator}
                    placeholder="D"
                    class="bg-gray-100 hover:bg-gray-300 py-0 w-16 border-l-1 border-r-0 border-t-0 border-b-0 rounded-none text-center"
                    size="sm"
                />
            </div>
            <div
                class="flex items-center border-2 border-gray-200 border-r-0 border-t-0 border-b-0 hover:bg-gray-200 cursor-default pr-2"
            >
                <span class="text-sm ml-4 mr-2">Pattern</span>
                <Select
                    items={complexityPatterns.map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={complexityPattern}
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
                    bind:value={bpm}
                    type="number"
                    id="bpm"
                    placeholder="120"
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
                    bind:value={division}
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
                    bind:value={tuplet}
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

    <div class="mt-1 flex ml-2">
        <div
            class="keyboard"
            style="grid-template-rows: repeat({numKeys}, {keyHeight}px); margin-right: 5px;"
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
        <div
            class="gridBackground"
            style="position: relative; height: {grid.totalHeight()}px; width: {grid.totalWidth(
                timeSignature,
            )}px"
        >
        <div class="bg-violet-300 opacity-30 h-full w-2 absolute top-0 left-0" 
        style="width: {timerPosX}px; z-index: 1;"/>
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
                    <button
                        type="button"
                        class="hover:bg-gray-200"
                        style="position: absolute; left: {posX}px; top: {keyIndex *
                            keyHeight}px; height: {keyHeight}px; width: {divisionLength}px;
                            "
                        on:mousedown={() => playNote(key)}
                    />
                {/each}
            {/each}
            {#each reverseKeys as key, keyIndex}
                <div
                    class="minorLine"
                    style="position: absolute; width: {grid.totalWidth(
                        timeSignature,
                    )}px; height: 1px; top: {keyIndex *
                        keyHeight}px; z-index: -1;"
                ></div>
            {/each}
            <div
                class="minorLine"
                style="position: absolute; width: {grid.totalWidth(
                    timeSignature,
                )}px; height: 1px; top: {grid.totalHeight()}px; z-index: -1;"
            ></div>
            {#each measureLines as posX, i}
                <div
                    class="measureLine top-0"
                    style="position: absolute; width: 1.5px; height: {grid.totalHeight()}px; left: {posX}px; z-index: 1;"
                ></div>
                <div
                    class="measureLine top-0"
                    style="position: absolute; width: 1.5px; height: {grid.totalHeight()}px; left: {posX +
                        3}px; z-index: 1;"
                ></div>
            {/each}
        </div>
    </div>
</div>

<style>
    .keyboard {
        display: grid;
    }

    .key {
        border: 1px solid #ccc;
        cursor: pointer;
        margin: 0;
    }
    .gridBackground {
        z-index: 1;
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
