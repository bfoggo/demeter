<script lang="ts">
    import { onMount } from "svelte";
    import { Note, pianoColor } from "../types/note";

    import {
        Button,
        Dropdown,
        Select,
        DropdownItem,
        Radio,
        Kbd,
        Label,
        Input
    } from "flowbite-svelte";

    import { ChevronDownOutline } from "flowbite-svelte-icons";

    import {
        PianoRollGrid,
        TimeSignature,
        parseBeatPatternString,
        beatPatternStr,
        Division,
    } from "../types/pianoRoll";
    const numOctaves = 2;
    const startOctave = 4;
    const keyHeight = 20;
    const keys = Array.from({ length: numOctaves }, (_, i) =>
        Note.allFromOctave(startOctave + i),
    ).flat();
    let grid = new PianoRollGrid(2, keys.length, keyHeight, 50);

    let timeSignatureNumerator = 4;
    let timeSignatureDenominator = 4;
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
    $: minorLines = grid.minorLinesPosX(timeSignature, Division.Quarter);
    $: measureLines = grid.measureLinesPosX(timeSignature);

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
    <div class="inline-flex ml-2 bg-gray-100 mt-2 divide-x">
        <div class="flex items-center text-sm ">
            <div class="flex divide-x">
                <div class="mx-2 h-full text-nowrap text-sm text-center border-b-2 py-2">Time signature</div>
                <Select
                    items={TimeSignature.allNumerators().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={timeSignatureNumerator}
                    placeholder="numerator"
                    class="w-14 ml-2 bg-gray-100 py-0 border-none"
                    underline={true}
                />
                <Select
                    items={TimeSignature.allDenominators().map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={timeSignatureDenominator}
                    placeholder="denominator"
                    class="w-14 bg-gray-100 py-0 border-none"
                    underline={true}
                    size="sm"
                />
                <Select
                    items={complexityPatterns.map((n) => {
                        return { value: n, name: n };
                    })}
                    bind:value={complexityPattern}
                    placeholder="pattern"
                    class="bg-gray-100 w-40 p-0 border-none"
                    size="sm"
                    underline={true}
                />
            </div>
        </div>
        <div class="flex w-10% bg-gray-100 items-center">
            <div class="mx-2 text-nowrap text-sm">BPM</div>
            <Input type="number" id="bpm" placeholder="120" required class="bg-gray-100 w-20 border-none text-sm"/>
        </div>
    </div>

    <div class="flex ml-2">
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
                    on:click={() => playNote(key)}
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
        background-color: #d1cbcb;
        z-index: 1;
    }
    .measureLine {
        background-color: #000000;
    }
    .majorLine {
        border-left-style: dashed;
        border-right: none;
        border-width: 2px;
        border-color: #00851660;
    }
    .minorLine {
        background-color: #a8a8a8;
    }
</style>
