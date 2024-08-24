<script lang="ts">
    import ChordBuild from "./chordBuild.svelte";
    import ChordGrid from "./chordGrid.svelte";
    import { Settings } from "./musicsettings.svelte";
    import type { ChordGrammar } from "../types/note";

    let { musicSettings }: { musicSettings: Settings } = $props();
    let builtChord: ChordGrammar = $state({
        root: { noteSet: "sharps", name: "C" },
    });
    let parsedChord: ChordGrammar = $state({
        root: { noteSet: "sharps", name: "C" },
    });
</script>

<ChordGrid {musicSettings} {builtChord} {parsedChord} />
<ChordBuild bind:builtChord></ChordBuild>
