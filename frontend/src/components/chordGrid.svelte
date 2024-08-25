<script lang="ts">
    import { asString, parseChord, type ChordGrammar } from "../types/note";
    import ChordBuild from "./chordBuild.svelte";
    import ChordGrid from "./chordGrid.svelte";
    import { Settings } from "./musicsettings.svelte";

    let {
        musicSettings,
        parsedChord = $bindable(),
        allChords = $bindable(),
    }: {
        musicSettings: Settings;
        parsedChord: ChordGrammar;
        allChords: ChordGrammar[];
    } = $props();

    let selectedMeasure = $state(0);

    function parseChordInput(input: string, idx: number) {
        parsedChord = parseChord(input, "sharps");
    }

    function pushNewDefaultChordIfNeeded() {
        if (allChords.length < musicSettings.complexityPattern.length * musicSettings.measures) {
            allChords.push({ root: { noteSet: "sharps", name: "C" } });
        }
    }

    function setChord(chord: ChordGrammar, idx: number) {
        allChords[idx] = chord;
    }

    $effect(() => {
        const correctLength = musicSettings.complexityPattern.length * musicSettings.measures;
        if (allChords.length < correctLength) {
            allChords = allChords.concat(Array.from({ length: correctLength - allChords.length }, () => ({root: { noteSet: "sharps", name: "C" } })))
        } else if (allChords.length > correctLength) {
            allChords = allChords.slice(0, correctLength);
        }
    }
    )

</script>

<div
    class="w-2/3 grid grid-cols-8 auto-cols-max grid-flow-row-dense divide-black divide-x-4 divide-dotted mr-4"
>
    {#each Array.from({ length: musicSettings.complexityPattern.length * musicSettings.measures }, (_, i) => i) as measure}
    {pushNewDefaultChordIfNeeded()}
    {#if measure == selectedMeasure}
        {setChord(parsedChord, measure)}
    {/if}
        <div class="col-span-1 h-9">
            <input
                type="text"
                class="w-full text-center h-full border-none shadow-md focus:ring-0 text-sm bg-{measure == selectedMeasure ? 'gray-100' : 'white'}"
                value={asString(allChords[measure])}
                onfocus={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target){
                        selectedMeasure = measure;
                        parseChordInput(target.value, measure);
                    }
                }
            }
                onchange={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target){
                        parseChordInput(target.value, measure);
                    }}
                }
            >
        </div>
    {/each}
</div>
