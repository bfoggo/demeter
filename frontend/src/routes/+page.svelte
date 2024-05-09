<script lang="ts">
    import { Note } from '../types/note'
    const numOctaves = 2;
    const numBeats = 16;
    const beatWidth = 20;
    const keyHeight = 10;
    const keys = Array.from({ length: numOctaves * 12 }, (_, i) => new Note(i % 12, Math.floor(i / 12)));
    let reverseKeys = keys.slice().reverse();
    let numKeys = keys.length;
    let pianoRoll = Array.from({ length: numKeys }, () => Array.from({ length: numBeats }, () => false));

    function toggleNote(key: number, beat: number) {
        pianoRoll[key][beat] = !pianoRoll[key][beat];
        pianoRoll = [...pianoRoll];
    }

</script>

<style>

    .keyboard {
        display: grid;
    }

    .piano-roll {
        display: grid;
    }

    .cell{
        border: 1px solid #ccc;
        cursor: pointer;
        margin: 0;
    }

    .key {
        border: 1px solid #ccc;
        cursor: pointer;
        margin: 0;
    }

</style>
<div style="display:flex; justify-content: flex-start">
    <div class="keyboard" style="grid-template-rows: repeat({numKeys}, {keyHeight}px); margin-right: 5px;">
        {#each reverseKeys as key, keyIndex}
            <div class="key" style="height: {keyHeight}px; width: 20px; background-color: {key.pianoColor()}">
            </div>
        {/each}
    </div>
    <div class="piano-roll" style="grid-template-columns: repeat({numBeats}, {beatWidth}px)">
        {#each pianoRoll as key, keyIndex}
            {#each key as beat, beatIndex}
                <button type="button" class="cell" style="width: {beatWidth}px; height: {keyHeight}px; 
                background-color: {pianoRoll[keyIndex][beatIndex] ? 'black' : 'white'}"
                    on:click={() => toggleNote(keyIndex, beatIndex)}>
                </button>
            {/each}
        {/each}
    </div>
</div>
