<script lang="ts">
    import { allTimeSignatureNumerators, allTimeSignatureDenominators, allDivisions, allTuplets, complexityPatterns } from "../types/rhythm";
    import type { Writable } from "svelte/store";
    import Select from "flowbite-svelte/Select.svelte";
    import type { MusicContext } from "../types/context";
    import Input from "flowbite-svelte/Input.svelte";
    export let musicContext: Writable<MusicContext>;
</script>

<div class="inline-flex ml-2 mt-2 h-10">
    <div class="flex text-sm">
        <div class="pl-1 pr-4 flex items-center cursor-default">
            <span class="text-sm pr-1 text-nowrap">Time Signature</span>
            <Select
                items={allTimeSignatureNumerators().map((n) => {
                    return { value: n, name: n };
                })}
                bind:value={$musicContext.timeSignature.numerator}
                on:change={() => {
                    $musicContext.reconstruct();
                }}
                placeholder="N"
                size="sm"
                defaultClass="border-none hover:bg-gray-50 w-20  text-center focus:ring-0 cursor-pointer"
            />
            <Select
                items={allTimeSignatureDenominators().map((n) => {
                    return { value: n, name: n };
                })}
                bind:value={$musicContext.timeSignature.denominator}
                placeholder="D"
                size="sm"
                defaultClass="border-none hover:bg-gray-50 select-none w-20 text-center focus:ring-0 cursor-pointer"
                on:change={() => {
                    $musicContext.reconstruct();
                }}
            />
        </div>
        <div
            class="flex items-center border-2 border-gray-100 border-r-0 border-t-0 border-b-0 cursor-default px-4"
        >
            <span class="text-sm pr-1 text-nowrap">Pattern</span>
            <Select
                items={complexityPatterns($musicContext.timeSignature).map(
                    (n) => {
                        return { value: n, name: n };
                    },
                )}
                bind:value={$musicContext.complexityPatternStr}
                placeholder="complexity pattern"
                size="sm"
                defaultClass="border-none hover:bg-gray-50 select-none w-40 text-center focus:ring-0 cursor-pointer"
            />
        </div>
        <div
            class="flex items-center border-2 border-gray-100 border-r-0 border-t-0 border-b-0 cursor-default px-4"
        >
            <span class="text-sm pr-1 text-nowrap">BPM</span>
            <Input
                bind:value={$musicContext.bpm}
                type="number"
                id="bpm"
                placeholder="bpm"
                size="sm"
                class="border-none rounded-none bg-white hover:bg-gray-50 select-none w-20 text-center focus:ring-0 cursor-pointer"
            />
        </div>
        <div
            class="flex items-center border-2 border-gray-100 border-r-0 border-t-0 border-b-0 cursor-default px-4"
        >
            <span class="text-sm text-nowrap pr-2">Division</span>
            <Select
                items={allDivisions().map((n) => {
                    return { value: n, name: n };
                })}
                bind:value={$musicContext.division}
                placeholder="division"
                defaultClass="border-none hover:bg-gray-50 select-none w-30 text-center focus:ring-0 cursor-pointer"
                size="sm"
            />
        </div>
        <div
            class="flex items-center border-2 border-gray-100 border-r-0 border-t-0 border-b-0 px-4"
        >
            <span class="text-sm pr-1 text-nowrap">Tuplet</span>
            <Select
                items={allTuplets().map((n) => {
                    return { value: n, name: n };
                })}
                bind:value={$musicContext.tuplet}
                placeholder="tuplet"
                defaultClass="border-none hover:bg-gray-50 select-none w-30 text-center focus:ring-0 cursor-pointer"
                size="sm"
            />
        </div>
    </div>
</div>
