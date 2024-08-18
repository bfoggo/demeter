<script lang="ts">
    import { kickSound, snareSound, type Stoppable } from "../types/sounds";
    import type { PlaybackTimer } from "./timer.svelte";
    import { tick } from "svelte";

    let {
        playbackTimer,
        majorLinesTimeX,
        minorLinesTimeX,
    }: {
        playbackTimer: PlaybackTimer;
        majorLinesTimeX: number[];
        minorLinesTimeX: number[];
    } = $props();

    var audioContext: AudioContext;
    $effect(() => {
        audioContext = new AudioContext();
    });

    var stoppables: Stoppable[] = [];
    $effect(() => {
        if (playbackTimer.playing) {
            stoppables = [];
            for (var majorLine of majorLinesTimeX) {
                stoppables.push(kickSound(majorLine, audioContext));
            }
            for (var minorLine of minorLinesTimeX) {
                stoppables.push(snareSound(minorLine, audioContext));
            }
        }
    });

    let stopOnTimer = (() => {
        if (!playbackTimer.playing) {
            for (var stoppable of stoppables) {
                stoppable.stop();
            }
            stoppables = [];
        }
    });
</script>

{stopOnTimer()}
