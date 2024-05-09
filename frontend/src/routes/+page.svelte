<script lang="ts">
    const numOctaves = 2;
    let numKeys = 12 * numOctaves;
    const keyNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const keyColors = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white']
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
        {#each Array.from({ length: numKeys }, (_, i) => i) as key}
            <div class="key" style="height: {keyHeight}px; width: 20px; background-color: {keyColors[key % 12]}">
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
