<script lang="ts">
    const numKeys = 12;
    const numBeats = 16;
    const beatWidth = 20;
    const keyHeight = 15;
    
    let pianoRoll = Array(numBeats).fill(Array(numKeys).fill(false));

    function toggleNote(beat: number, key: number) {
        pianoRoll[beat][key] = !pianoRoll[beat][key];
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
            <div class="cell"  style="background-color: {beat ? 'black' : 'white'}; width: {beatWidth}px; height: {keyHeight}px"></div>
        {/each}
    {/each}
</div>