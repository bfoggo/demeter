<script lang="ts">
    import ChordBuild from "./chordBuild.svelte";
    import ChordGrid from "./chordGrid.svelte";
    import { Settings, majorTimes } from "./musicsettings.svelte";
    import type { ChordGrammar } from "../types/note";
    import ChordPlayback from "./chordPlayback.svelte";
    import type { PlaybackTimer } from "./timer.svelte";

    let {
        musicSettings,
        playbackTimer,
    }: { musicSettings: Settings; playbackTimer: PlaybackTimer } = $props();
    let syncedChord: ChordGrammar = $state({
        root: { noteSet: "sharps", name: "C" },
    });

    let allChords = $state([]);
</script>

<ChordGrid bind:parsedChord={syncedChord} {musicSettings} bind:allChords />
<ChordBuild bind:builtChord={syncedChord} />
<ChordPlayback
    settings={musicSettings}
    {playbackTimer}
    chordPositions={Array.from({ length: musicSettings.measures * musicSettings.complexityPattern.length }, (_, i) => ({
        timeX: majorTimes(musicSettings)[i],
        chord: allChords[i],
    }))}
/>
