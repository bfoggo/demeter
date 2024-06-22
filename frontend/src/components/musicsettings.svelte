<script lang="ts">
    import {TimeSignature, allDivisions, allTuplets} from "../types/pianoRoll";
    import type { Writable } from "svelte/store";
    import Select from "flowbite-svelte/Select.svelte";
    import type { MusicContext } from "../types/context";
    import Input from "flowbite-svelte/Input.svelte";
    export let musicContext: Writable<MusicContext>
</script>

<div class="inline-flex ml-2 bg-gray-100 mt-2 h-10">
    <div class="flex text-sm">
        <div class="flex items-center hover:bg-gray-200 cursor-default pr-2">
            <span class="ml-4 mr-2 text-sm">Time Signature</span>
            <Select
                items={TimeSignature.allNumerators().map((n) => {
                    return { value: n, name: n };
                })}
                bind:value={$musicContext.timeSignature.numerator}
                on:change={() => {
                    $musicContext.reInitialiizePatternStr();
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
                    $musicContext.reInitialiizePatternStr();
                }}
            />
        </div>
        <div
            class="flex items-center border-2 border-gray-200 border-r-0 border-t-0 border-b-0 hover:bg-gray-200 cursor-default pr-2"
        >
            <span class="text-sm ml-4 mr-2">Pattern</span>
            <Select
                items={$musicContext.timeSignature
                    .complexityPatterns()
                    .map((n) => {
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
</div>
