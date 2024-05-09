<script lang="ts">
    const numKeys = 12;
    const numBeats = 16;
    const beatWidth = 20;
    const keyHeight = 10;
    
    let pianoRoll = Array.from({ length: numKeys }, () => Array.from({ length: numBeats }, () => false));

    function toggleNote(key: number, beat: number) {
        pianoRoll[key][beat] = !pianoRoll[key][beat];
        pianoRoll = [...pianoRoll];
    }

</script>

<style>
    .piano-roll {
        display: grid;
    }

    .cell{
        border: 1px solid #ccc;
        cursor: pointer;
        margin: 0;
    }

</style>

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