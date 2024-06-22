<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { Note, pianoRollColor } from "../types/note";
    import { MusicContext } from "../types/context";
    import Keyboard from "../components/keyboard.svelte";
    import { writable } from "svelte/store";
    import MusicSettings from "../components/musicsettings.svelte";
    import GridVeiw from "../components/gridview.svelte";
    import { PianoRollNote, PianoRollGrid } from "../types/pianoRoll";
    import { PlaybackTimer } from "../types/playback";
    import { kickSound, highHatSound, noteSound } from "../types/sounds";
    import type { Stoppable } from "../types/sounds";

    var audioContext: AudioContext;
    onMount(() => {
        audioContext = new AudioContext();
    });
    let musicContext = writable(new MusicContext());
    let timer = writable(new PlaybackTimer());

    const keyHeight = 20;
    const eighthNoteWidth = 80;

    $: grid = new PianoRollGrid($musicContext, keyHeight, eighthNoteWidth);
    $: reverseKeys = $musicContext.keys().slice().reverse();

    var midiNotes: PianoRollNote[] = [];

    function playNote(note: Note) {
        noteSound(0.0, note.frequency(), audioContext);
    }

    function startTimer() {
        timer.update((t) => {
            t.start();
            return t;
        });
    }
    function stopTimer() {
        timer.update((t) => {
            t.stop();
            return t;
        });
    }

    $: if ($musicContext) {
        stopTimer();
    }

    var timerIntervalid: number | null;
    var stoppables: Stoppable[] = [];
    var elapsedTime: number = 0;
    var timerPosX: number = 0;
    timer.subscribe((t) => {
        if (t.playing) {
            stoppables = [];
            for (var majorLine of grid.majorLinesPosX()) {
                let time_at_major_line = grid.posXToTime(majorLine);
                stoppables.push(kickSound(time_at_major_line, audioContext));
            }
            for (var minorLine of grid.minorLinesPosX()) {
                let time_at_minor_line = grid.posXToTime(minorLine);
                stoppables.push(highHatSound(time_at_minor_line, audioContext));
            }
            for (var midiNote of midiNotes) {
                let time_at_midi_note = grid.posXToTime(midiNote.startPosX);
                stoppables.push(
                    noteSound(
                        time_at_midi_note,
                        $musicContext
                            .keys()
                            [
                                $musicContext.keys().length - midiNote.key - 1
                            ].frequency(),
                        audioContext,
                    ),
                );
            }
            timerIntervalid = setInterval(() => {
                elapsedTime = t.getElapsedSeconds();
                timerPosX = grid.timeToPosX(elapsedTime);
                if (timerPosX > grid.totalWidth()) {
                    stopTimer();
                }
            }, 10);
        } else {
            timerPosX = 0;
            if (timerIntervalid) {
                clearInterval(timerIntervalid);
            }
            for (var stoppable of stoppables) {
                stoppable.stop();
            }
        }
    });
</script>

<div class="divide-y-2">
    <MusicSettings {musicContext} />

    <div class="mt-1 flex ml-2 py-2">
        <Keyboard
            keys={$musicContext.keys()}
            {keyHeight}
            width={30}
            {playNote}
            noteColors={pianoRollColor}
        />
        <GridVeiw
            {grid}
            playbackTimer={timer}
            {midiNotes}
            {musicContext}
            {playNote}
            {reverseKeys}
            {pianoRollColor}
        />
    </div>
</div>
<button
    type="button"
    class="flex items-center jusitfy-center border-2 border-gray-200 hover:bg-gray-200 border-r-0 border-t-0 border-b-0 px-2"
    on:click={() => {
        stopTimer();
        startTimer();
    }}
>
    <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
    >
        <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 16.881V7.119a1 1 0 0 1 1.636-.772l5.927 4.881a1 1 0 0 1 0 1.544l-5.927 4.88A1 1 0 0 1 8 16.882Z"
        />
    </svg>
</button>
