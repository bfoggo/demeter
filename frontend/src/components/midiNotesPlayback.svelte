<script lang="ts">
    import { frequency } from "../types/note";
    import { noteBlipSound, type Stoppable } from "../types/sounds";
    import type { Settings } from "./musicsettings.svelte";
    import type { PlaybackTimer } from "./timer.svelte";

    let {
        settings,
        playbackTimer,
        midiPositions,
    }: {
        settings: Settings;
        playbackTimer: PlaybackTimer;
        midiPositions: { timeX: number; key: number }[];
    } = $props();

    var audioContext: AudioContext;
    $effect(() => {
        audioContext = new AudioContext();
    });

    var stoppables: Stoppable[];
    $effect(() => {
        if (playbackTimer.playing) {
            for (var midiNote of midiPositions) {
                let time_at_midi_note = midiNote.timeX;
                stoppables.push(
                    noteBlipSound(
                        time_at_midi_note,
                        frequency(
                            settings.keys[
                                settings.keys.length - midiNote.key - 1
                            ],
                        ),
                        audioContext,
                    ),
                );
            }
        }
    });
</script>
