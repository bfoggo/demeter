<script lang="ts">
    import type { Writable, get } from "svelte/store";
    import type { HexString, Note } from "../types/note";
    import type { PianoRollGrid, PianoRollNote } from "../types/pianoRoll";

    export let pianoRollColor: (note: Note) => HexString;
    export let midiNotes: Writable<Set<PianoRollNote>>;
    export let grid: PianoRollGrid;
    export let reverseKeys: Note[];
    export let playNote: (note: Note) => void;

    var startX: number;
    var startY: number;

    function leftMinorLine(posX: number): number {
        return Math.floor(posX / grid.divisionLength());
    }
    function keyAt(posY: number): number {
        console.log(posY, posY / grid.keyHeight);
        return  Math.floor(posY / grid.keyHeight);
    }

    var currentElement: HTMLElement;
</script>

<div>
    {#each $midiNotes as midiNote}
        <div
            bind:this={currentElement}
            draggable="true"
            role="button"
            tabindex="-1"
            class="opacity-50 hover:bg-gray-400 border-2 border-black z-2"
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
            on:dragstart={(e) => {
                console.log(midiNote)
                startX = e.clientX;
                startY = e.clientY;
            }}
            on:dragend={(e) => {
                e.preventDefault();
                let deltaX = e.clientX - startX;
                let deltaY = e.clientY - startY;
                console.log(deltaX, deltaY);
                let leftLine = leftMinorLine(midiNote.startPosX + deltaX);
                let key = keyAt(
                    midiNote.startPosY + deltaY
                );
                midiNote.startPosX = leftLine * grid.divisionLength();
                midiNote.key = key;
                midiNote.startPosY = key * grid.keyHeight;
                midiNotes = midiNotes;
                startX = 0;
                startY = 0;
            }}
        ></div>
    {/each}
</div>
