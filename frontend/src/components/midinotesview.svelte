<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { HexString, Note } from "../types/note";
    import type { PianoRollGrid, PianoRollNote } from "../types/pianoRoll";

    export let pianoRollColor: (note: Note) => HexString;
    export let midiNotes: Writable<Set<PianoRollNote>>;
    export let grid: PianoRollGrid;
    export let reverseKeys: Note[];
    export let playNote: (note: Note) => void;
</script>

{#each $midiNotes as midiNote}
    <div
        role="button"
        tabindex="-1"
        class="opacity-50 hover:bg-gray-400 border-2 border-black"
        style="background: {pianoRollColor(reverseKeys[midiNote.key])};
                        position: absolute; left: {midiNote.startPosX}px; top: {midiNote.key *
            grid.keyHeight}px; height: {grid.keyHeight}px; width: {midiNote.duration}px;"
        on:dblclick={() => {
            $midiNotes.delete(midiNote);
            midiNotes = midiNotes;
        }}
        on:click={() => {
            playNote(reverseKeys[midiNote.key]);
        }}
        on:keydown={(e) => {
            if (e.key === "Delete") {
                $midiNotes.delete(midiNote);
                midiNotes = midiNotes;
            }
        }}
    ></div>
{/each}
