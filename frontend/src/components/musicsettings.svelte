<script context="module" lang="ts">
    export class Settings {
        numOctaves: number = $state(2);
        startOctave: number = $state(4);
        timeSignature: TimeSignature = $state({ numerator: 4, denominator: 4 });
        measures: number = $state(2);
        bpm: number = $state(120);
        division: Division = $state("Quarter");
        tuplet: Tuplet = $state("None");
        keys: Note[] = $state(
            [4, 5].map((v, _) => allNotesInOctave(v as Octave)).flat(),
        );
        complexityPattern: string = $state(
            complexityPatterns(this.timeSignature)[0],
        );
    }

    export function majorTimes(settings: Settings): number[] {
        const times = [];
        let curr_time = 0;
        for (let i = 0; i < settings.measures; i++) {
            for (const complexity of settings.complexityPattern) {
                times.push(curr_time);
                switch (complexity) {
                    case "S":
                        curr_time += 60 / settings.bpm;
                        break;
                    case "C":
                        curr_time += (60 / settings.bpm) * 1.5;
                        break;
                }
            }
        }
        console.log(times);
        return times;
    }
</script>

<script lang="ts">
    import {
        allTimeSignatureNumerators,
        allTimeSignatureDenominators,
        allDivisions,
        allTuplets,
        complexityPatterns,
        type TimeSignature,
        type Division,
        type Tuplet,
    } from "../types/rhythm";
    import Select from "flowbite-svelte/Select.svelte";
    import Input from "flowbite-svelte/Input.svelte";
    import { allNotesInOctave, type Note, type Octave } from "../types/note";
    import { Modal } from "flowbite-svelte";
    import CircleOfFifths from "./circleOfFifths.svelte";

    let keyModal = $state(false);

    let {
        settings = $bindable(),
    }: {
        settings: Settings;
    } = $props();

    $effect(() => {
        settings.complexityPattern = complexityPatterns(
            settings.timeSignature,
        )[0];
    });
    $effect(() => {
        const allOctaves = Array.from(
            { length: settings.numOctaves },
            (_, i) => (settings.startOctave + i) as Octave,
        );
        settings.keys = allOctaves
            .map((o, _) => allNotesInOctave(o as Octave))
            .flat();
    });
</script>

<div class="inline-flex mt-2 h-10">
    <div class="flex text-sm">
        <div class="pl-1 pr-4 flex items-center cursor-default">
            <span class="text-sm pr-1 text-nowrap">Time Signature</span>
            <Select
                items={allTimeSignatureNumerators().map((n) => {
                    return { value: n, name: n };
                })}
                bind:value={settings.timeSignature.numerator}
                placeholder="N"
                size="sm"
                defaultClass="border-none hover:bg-gray-50 w-20  text-center focus:ring-0 cursor-pointer"
            />
            <Select
                items={allTimeSignatureDenominators().map((n) => {
                    return { value: n, name: n };
                })}
                bind:value={settings.timeSignature.denominator}
                placeholder="D"
                size="sm"
                defaultClass="border-none hover:bg-gray-50 select-none w-20 text-center focus:ring-0 cursor-pointer"
            />
        </div>
        <div
            class="flex items-center border-2 border-gray-100 border-r-0 border-t-0 border-b-0 cursor-default px-4"
        >
            <span class="text-sm pr-1 text-nowrap">Pattern</span>
            <Select
                items={complexityPatterns(settings.timeSignature).map((n) => {
                    return { value: n, name: n };
                })}
                bind:value={settings.complexityPattern}
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
                bind:value={settings.bpm}
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
                bind:value={settings.division}
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
                bind:value={settings.tuplet}
                placeholder="tuplet"
                defaultClass="border-none hover:bg-gray-50 select-none w-30 text-center focus:ring-0 cursor-pointer"
                size="sm"
            />
        </div>
        <div
            class="flex items-center border-2 border-gray-100 border-r-0 border-t-0 border-b-0 px-0 h-full"
        >
            <button
                onclick={() => (keyModal = true)}
                class="text-center p-2 hover:bg-gray-100 rounded-full ml-2"
                >Key</button
            >
            <Modal title="Key Select" bind:open={keyModal}>
                <CircleOfFifths></CircleOfFifths>
            </Modal>
        </div>
    </div>
</div>
