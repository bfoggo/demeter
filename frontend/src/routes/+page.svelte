<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { Note, pianoRollColor } from "../types/note";
    import { MusicContext } from "../types/context";
    import Keyboard from "../components/keyboard.svelte";
    import { writable, type Writable } from "svelte/store";
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

    var midiNotes: Writable<Set<PianoRollNote>> = writable(new Set());


    function playNote(note: Note) {
        noteSound(0.0, note.frequency(), audioContext);
    }
    var playbackTimeouts: Set<Note> = new Set();
    function playNoteThrottled(note: Note) {
        console.log(playbackTimeouts)
        if (playbackTimeouts.has(note)) {
            return;
        }
        playNote(note);
        playbackTimeouts.add(note);
        let timeoutId = setTimeout(() => {
            playbackTimeouts.delete(note);
        }, 200);
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
            for (var midiNote of $midiNotes) {
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

    function handlePlayClick() {
        if ($timer.playing) {
            stopTimer();
        } else {
            startTimer();
        }
    }
</script>

<div class="divide-y-2">
    <MusicSettings {musicContext} />

    <div class="mt-1 flex ml-2 py-2">
        <Keyboard
            keys={$musicContext.keys()}
            {keyHeight}
            width={30}
            playNote={playNoteThrottled}
            noteColors={pianoRollColor}
        />
        <GridVeiw
            {grid}
            playbackTimer={timer}
            {midiNotes}
            {musicContext}
            playNote={playNoteThrottled}
            {reverseKeys}
            {pianoRollColor}
        />
    </div>
</div>
<button
    type="button"
    class="flex items-center jusitfy-center border-2 border-gray-200 hover:bg-gray-200 border-r-0 border-t-0 border-b-0 px-2"
    on:click={() => {
        handlePlayClick();
    }}
    >{#if !$timer.playing}
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 3.73241C3 2.54878 4.30673 1.83146 5.30531 2.46692L12.0114 6.73441C12.9376 7.32384 12.9376 8.67597 12.0114 9.2654L5.30532 13.5329C4.30673 14.1684 3 13.451 3 12.2674V3.73241Z"
                fill="black"
            />
        </svg>
    {:else}
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="3" y="3" width="10" height="10" rx="1.5" fill="black" />
        </svg>
    {/if}
</button>
