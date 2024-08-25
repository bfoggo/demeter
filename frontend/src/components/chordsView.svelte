<script lang="ts">
    import ChordBuild from "./chordBuild.svelte";
    import ChordGrid from "./chordGrid.svelte";
    import { Settings } from "./musicsettings.svelte";
    import type { ChordGrammar } from "../types/note";

    let { musicSettings }: { musicSettings: Settings } = $props();
    let syncedChord: ChordGrammar = $state({
        root: { noteSet: "sharps", name: "C" },
    });
    
</script>

<ChordGrid bind:parsedChord={syncedChord} {musicSettings} />
<ChordBuild bind:builtChord={syncedChord} />