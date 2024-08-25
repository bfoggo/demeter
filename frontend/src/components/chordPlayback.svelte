<script lang="ts">
    import { frequency, toNotes, type ChordGrammar } from "../types/note";
    import { noteBlipSound, type Stoppable } from "../types/sounds";
    import type { Settings } from "./musicsettings.svelte";
    import type { PlaybackTimer } from "./timer.svelte";

    let {
        settings,
        playbackTimer,
        chordPositions,
    }: {
        settings: Settings;
        playbackTimer: PlaybackTimer;
        chordPositions: { timeX: number; chord: ChordGrammar }[];
    } = $props();

    var audioContext: AudioContext;
    var stoppables: Stoppable[] = [];

    $effect(() => {
        audioContext = new AudioContext();
    });

    $effect(() => {
        if (playbackTimer.playing) {
            for (var chord of chordPositions) {
                for (var note of toNotes(chord.chord))
                    stoppables.push(
                        noteBlipSound(
                            chord.timeX,
                            frequency(note),
                            audioContext,
                        ),
                    );
            }
        }
    });

    $effect(() => {
        if (!playbackTimer.playing) {
            for (var stoppable of stoppables) {
                stoppable.stop();
            }
            stoppables = [];
        }
    });
</script>
