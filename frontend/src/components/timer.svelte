<script context="module" lang="ts">
    import type { TimeSignature } from "../types/rhythm";

    export class PlaybackTimer {
        startTime: Date = new Date();
        playing: boolean = $state(false);

        start() {
            this.startTime = new Date();
            this.playing = true;
        }

        stop() {
            this.playing = false;
        }

        getElapsedSeconds() {
            if (this.playing) {
                return (new Date().getTime() - this.startTime.getTime()) / 1000;
            }
            return 0;
        }

        totalSeconds(
            timeSignature: TimeSignature,
            bpm: number,
            measures: number,
        ) {
            if (timeSignature.denominator == 4) {
                return ((measures * timeSignature.numerator) / bpm) * 60;
            } else {
                return (((measures * timeSignature.numerator) / bpm) * 60) / 2;
            }
        }
    }
</script>
