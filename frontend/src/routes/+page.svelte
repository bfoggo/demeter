<script lang="ts">
    import { onMount } from "svelte";
    import { Note, pianoColor } from "../types/note";

    import Select from "flowbite-svelte/Select.svelte";
    import Input from "flowbite-svelte/Input.svelte";

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
    $:console.log(minorLines);
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
            <div class="flex items-center">
                <span class="ml-4 text-sm">Time Signature</span>
                <Select
                    items={TimeSignature.allNumerators().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={timeSignatureNumerator}
                    placeholder="N"
                    class="bg-gray-100 py-0 w-16 border-none rounded-none text-center text-align-center"
                />
                <Select
                    items={TimeSignature.allDenominators().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={timeSignatureDenominator}
                    placeholder="D"
                    class="bg-gray-100 py-0 w-16 border-l-1 border-r-0 border-t-0 border-b-0 rounded-none text-center "
                    size="sm"
                />
            </div>
            <div
                class="flex items-center border-2 border-gray-300 border-r-0 border-t-0 border-b-0"
            >
                <span class="text-sm ml-4">Pattern</span>
                <Select
                    items={complexityPatterns.map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={complexityPattern}
                    placeholder="complexity pattern"
                    class="bg-gray-100 p-0 w-40 border-none rounded-none text-center "
                    size="sm"
                />
            </div>
            <div
                class="flex bg-gray-100 items-center border-2 border-gray-300 border-r-0 border-t-0 border-b-0 mr-2"
            >
                <span class="text-sm ml-4">BPM</span>
                <Input
                    type="number"
                    id="bpm"
                    placeholder="120"
                    required
                    class="bg-gray-100 w-20 border-none rounded-none p-0 text-center text-sm"
                />
            </div>
            <div
                class="flex items-center border-2 border-gray-300 border-r-0 border-t-0 border-b-0"
            >
                <span class="text-sm ml-4 mr-2">Division</span>
                <Select
                    items={allDivisions().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={division}
                    placeholder="complexity pattern"
                    class="bg-gray-100 p-0 w-32 border-none rounded-none text-center text-sm"
                    size="sm"
                />
                <div
                    class="flex items-center border-2 border-gray-300 border-r-0 border-t-0 border-b-0"
                >
                    <span class="text-sm ml-4">Tuplet</span>
                    <Select
                        items={allTuplets().map((n) => {
                            return { value: n, name: n };
                        })}
                        bind:value={tuplet}
                        placeholder="complexity pattern"
                        class="bg-gray-100 p-0 w-32 border-none rounded-none text-center text-sm"
                        size="sm"
                    />
                </div>
            </div>
        </div>
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
            {#each majorLines as posX, i}
                <div
                    class="majorLine"
                    style="position: absolute; width: 1px; height: {grid.totalHeight()}px; left: {posX}px;"
                ></div>
            {/each}
            {#each minorLines as posX, i}
                <div
                    class="minorLine"
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
                    class="measureLine"
                    style="position: absolute; width: 1.5px; height: {grid.totalHeight()}px; left: {posX}px; z-index: 1;"
                ></div>
                <div
                    class="measureLine"
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
