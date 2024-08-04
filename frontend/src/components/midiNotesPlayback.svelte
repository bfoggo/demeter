<script lang="ts">
    import { frequency } from "../types/note";
    import { noteBlipSound, type Stoppable } from "../types/sounds";
    import type { MusicContext } from "./musicsettings.svelte";
    import type { PlaybackTimer } from "./timer.svelte";

    let {
        musicContext,
        playbackTimer,
        midiPositions,
    }: {
        musicContext: MusicContext;
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
                            musicContext.keys[
                                musicContext.keys.length - midiNote.key - 1
                            ],
                        ),
                        audioContext,
                    ),
                );
            }
        }
    });
</script>
