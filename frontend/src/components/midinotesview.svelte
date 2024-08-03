<script lang="ts">
    import type { Writable, get } from "svelte/store";
    import type { HexString, Note, NoteName} from "../types/note";
    import type { PianoRollGrid, PianoRollNote } from "../types/pianoRoll";

    let {pianoRollColor, midiNotes, grid, reverseKeys, playNote}: {
        pianoRollColor: (note: NoteName) => HexString;
        midiNotes: Set<PianoRollNote>;
        grid: PianoRollGrid;
        reverseKeys: Note[];
        playNote: (note: Note) => void;
    } = $props();

    var startX: number;
    var startY: number;

    function minorLineAt(posX: number): number {
        if (posX < 0) {
            return 0;
        }
        let left = Math.floor(posX / grid.divisionLength());
        let right = Math.ceil(posX / grid.divisionLength());
        if (left === right) {
            return left;
        }
        if (
            Math.abs(left * grid.divisionLength() - posX) <
            Math.abs(right * grid.divisionLength() - posX)
        ) {
            return left;
        }
        return right;
    }
    function keyAt(posY: number): number {
        if (posY < 0) {
            return 0;
        }
        let above = Math.floor(posY / grid.keyHeight);
        let below = Math.ceil(posY / grid.keyHeight);
        if (above === below) {
            return above;
        }
        if (
            Math.abs(above * grid.keyHeight - posY) <
            Math.abs(below * grid.keyHeight - posY)
        ) {
            return above;
        }
        return below;
    }

    var currentElement: HTMLElement | undefined = $state();
    var colorCheckInterval: number;
</script>

<div>
    {#each midiNotes as midiNote}
        <div
            bind:this={currentElement}
            draggable="true"
            role="button"
            tabindex="-1"
            class="opacity-50 hover:bg-gray-400 border-2 border-black z-2"
            style="background: {pianoRollColor(reverseKeys[midiNote.key].name)};
                        position: absolute; left: {midiNote.startPosX}px; top: {midiNote.key *
                grid.keyHeight}px; height: {grid.keyHeight}px; width: {midiNote.duration}px;"
            ondblclick={() => {
                midiNotes.delete(midiNote);
                midiNotes = midiNotes;
            }}
            onclick={() => {
                playNote(reverseKeys[midiNote.key]);
            }}
            onkeydown={(e) => {
                if (e.key === "Delete") {
                    midiNotes.delete(midiNote);
                    midiNotes = midiNotes;
                }
            }}
            ondragstart={(e) => {
                startX = e.clientX;
                startY = e.clientY;
                if (e.target instanceof HTMLElement) {
                    currentElement = e.target;
                    currentElement.style.backgroundColor = "#E5E7EB";
                }
            }}
            ondragover={(e) => {
                e.preventDefault();
            }}
            ondragend={(e) => {
                e.preventDefault();
                clearInterval(colorCheckInterval);
                let deltaX = e.clientX - startX;
                let deltaY = e.clientY - startY;
                let leftLine = minorLineAt(midiNote.startPosX + deltaX);
                let key = keyAt(midiNote.startPosY + deltaY);
                midiNote.startPosX = leftLine * grid.divisionLength();
                midiNote.key = key;
                midiNote.startPosY = key * grid.keyHeight;
                midiNotes = midiNotes;
                startX = 0;
                startY = 0;
                playNote(reverseKeys[key])
            }}
        ></div>
    {/each}
</div>
