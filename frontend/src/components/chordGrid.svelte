<script lang="ts">
    import { parseChord, type ChordGrammar } from "../types/note";
    import ChordBuild from "./chordBuild.svelte";
    import ChordGrid from "./chordGrid.svelte";
    import { Settings } from "./musicsettings.svelte";

    let {
        musicSettings,
        parsedChord = $bindable(),
    }: {
        musicSettings: Settings;
        parsedChord: ChordGrammar;
    } = $props();

    let selectedMeasure = $state(0);
    let allChords: ChordGrammar[] = $derived.by(() => {
        return Array.from({ length: musicSettings.complexityPattern.length * musicSettings.measures }, (_, i) => {
            return { root: { noteSet: "sharps", name: "C" } } as ChordGrammar;
        });
    });

    $inspect(allChords)

    function parseChordInput(input: string, idx: number) {
        parsedChord = parseChord(input, "sharps");
        allChords[idx] = parsedChord;
    }

</script>

<div
    class="w-2/3 grid grid-cols-8 auto-cols-max grid-flow-row-dense gap-1 mr-4"
>
    {#each Array.from({ length: musicSettings.complexityPattern.length * musicSettings.measures }, (_, i) => i) as measure}
        <div class="col-span-1 h-9">
            <input
                type="text"
                class="w-full text-center h-full text-sm"
                
                value={allChords[measure].root.name}
                onclick={(e) => {
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
