<script lang="ts">
    import type { Note, NoteName } from "../types/note";
    import type { HexString } from "../types/note";
    import { noteBlipSound } from "../types/sounds";
    let {keys, keyHeight, width, playNote, noteColors}: {
        keys: Note[];
        keyHeight: number;
        width: number;
        playNote: (note: Note, sound:(time: number, frequency: number, audioContext: AudioContext) => void) => void;
        noteColors: (note: NoteName) => HexString;
    } = $props();

    let reverseKeys = $derived(keys.slice().reverse());
</script>

<div
    class="grid pr-5"
    style="grid-template-rows: repeat({keys.length}, {keyHeight}px);"
>
    {#each reverseKeys as key, keyIndex}
        <button
            style="height: {keyHeight}px; width: {width}px; background-color: {noteColors(
                key.name,
            )}"
            class="border-2 border-black border-r-0 cursor-pointer margin-0"
            type="button"
            
            onmousedown={() => playNote(key, noteBlipSound)}
        >
        </button>
    {/each}
</div>
