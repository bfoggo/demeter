<script lang="ts">
    import type { Note } from "../types/note";
    import { pianoRollColor, frequency } from "../types/note";
    import { Settings } from "../components/musicsettings.svelte";
    import Keyboard from "../components/keyboard.svelte";
    import MusicSettings from "../components/musicsettings.svelte";
    import GridVeiw from "../components/gridview.svelte";
    import { PlaybackTimer } from "../components/timer.svelte";
    import { noteBlipSound } from "../types/sounds";
    import ChordsView from "../components/chordsView.svelte";
    import ChordBuild from "../components/chordBuild.svelte";

    var audioContext: AudioContext;
    $effect(() => {
        audioContext = new AudioContext();
    });
    let settings: Settings = $state(new Settings());
    let timer = $state(new PlaybackTimer());

    let stopTimerOnAnySettingsChange = () => {
        let _ = {
            numOctaves: settings.numOctaves,
            startOctave: settings.startOctave,
            timeSignature: settings.timeSignature,
            measures: settings.measures,
            bpm: settings.bpm,
            division: settings.division,
            tuplet: settings.tuplet,
            keys: settings.keys,
            complexityPattern: settings.complexityPattern,
        };
        timer.stop();
    };

    const keyHeight = 16;
    const eighthNoteWidth = 80;

    var playbackTimeouts: Set<Note> = new Set();
    function playNoteThrottled(note: Note) {
        if (playbackTimeouts.has(note)) {
            return;
        }
        noteBlipSound(0.0, frequency(note), audioContext);
        playbackTimeouts.add(note);
        let timeoutId = setTimeout(() => {
            playbackTimeouts.delete(note);
        }, 500);
    }

    function handlePlayClick() {
        if (timer.playing) {
            timer.stop();
        } else {
            timer.start();
        }
    }

    let keyboardElement: HTMLElement | null = $state(null);
    let keyboardWidth = $derived.by(() =>
        keyboardElement ? keyboardElement.clientWidth : 50,
    );
</script>

<div class="ml-2">
    <MusicSettings bind:settings />

    <div class="mt-1 flex py-2">
        <Keyboard
            keys={settings.keys}
            {keyHeight}
            width={30}
            playNote={playNoteThrottled}
            noteColors={pianoRollColor}
            bind:element={keyboardElement}
        />
        <GridVeiw
            {settings}
            grid={{ keyHeight, eighthNoteWidth }}
            playbackTimer={timer}
            playClickedNote={playNoteThrottled}
        />
    </div>
    <button
        type="button"
        class="flex items-center jusitfy-center border-gray-200 hover:bg-gray-200 pb-2"
        onclick={() => {
            handlePlayClick();
        }}
        >{#if !timer.playing}
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
                <rect
                    x="3"
                    y="3"
                    width="10"
                    height="10"
                    rx="1.5"
                    fill="black"
                />
            </svg>
        {/if}
    </button>
    <div class="mt-1 flex py-2">
        <div class="h-1" style="width: {keyboardWidth}px;"></div>
        <ChordsView musicSettings={settings} playbackTimer={timer}></ChordsView>
    </div>
</div>
{stopTimerOnAnySettingsChange()}
