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
    var stoppables: Stoppable[] = [];

    $effect(() => {
        audioContext = new AudioContext();
    });

    $effect(() => {
        if (playbackTimer.playing) {
            for (var midi of midiPositions) {
                stoppables.push(
                    noteBlipSound(
                        midi.timeX,
                        frequency(
                            settings.keys[
                                settings.keys.length - midi.key - 1
                            ],
                        ),
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
