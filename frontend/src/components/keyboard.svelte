<script lang="ts">
    import type { Note } from "../types/note";
    import type { HexString } from "../types/hexstring";

    export let keys: Note[];
    export let keyHeight: number;
    export let width: number;
    export let playNote: (note: Note) => void;
    export let noteColors: (note: Note) => HexString;

    $: reverseKeys = keys.slice().reverse();
</script>

<div
    class="grid pr-5"
    style="grid-template-rows: repeat({keys.length}, {keyHeight}px);"
>
    {#each reverseKeys as key, keyIndex}
        <button
            style="height: {keyHeight}px; width: {width}px; background-color: {noteColors(
                key,
            )}"
            class="border-2 border-black border-r-0 cursor-pointer margin-0"
            type="button"
            
            on:mousedown={() => playNote(key)}
        >
        </button>
    {/each}
</div>
