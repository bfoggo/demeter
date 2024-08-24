<script lang="ts">
    import type { ChordGrammar } from "../types/note";
    import ChordBuild from "./chordBuild.svelte";
    import ChordGrid from "./chordGrid.svelte";
    import { Settings } from "./musicsettings.svelte";

    let {
        musicSettings,
        builtChord,
        parsedChord = $bindable(),
    }: {
        musicSettings: Settings;
        builtChord: ChordGrammar;
        parsedChord: ChordGrammar;
    } = $props();
</script>

<div
    class="w-2/3 grid grid-cols-8 auto-cols-max grid-flow-row-dense gap-1 mr-4"
>
    {#each Array.from({ length: musicSettings.complexityPattern.length * musicSettings.measures }, (_, i) => i) as measure}
        <div class="col-span-1 h-9 border-2 border-black">
            <input
                type="text"
                class="w-full text-center h-full text-sm"
                value={""}
            />
        </div>
    {/each}
</div>
