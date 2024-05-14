<script lang="ts">
    import {onMount} from 'svelte'
    import { Note, pianoColor } from '../types/note'
    import { PianoRollGrid, TimeSignature, TimeSignatureDenominator } from '../types/pianoRoll'
    import Dropdown from '../components/dropdown.svelte'
    const numOctaves = 2;
    const startOctave = 4;
    const numMeasures = 1;
    const quarterNoteWidth = 20;
    let eighthNoteWidth = quarterNoteWidth / 2;
    const keyHeight = 10;
    let timeSignatureNumeratorString = '4';
    let timeSignatureNumerator = parseInt(timeSignatureNumeratorString)
    let timeSignatureDenominatorString = '4';
    let timeSignatureDenominator = parseInt(timeSignatureDenominatorString)

    var audioContext: AudioContext;
    onMount(() => {
        audioContext = new AudioContext();
    })

    const keys = Array.from({ length: numOctaves }, (_, i) => Note.allFromOctave(startOctave + i)).flat();
    let reverseKeys = keys.slice().reverse();
    let numKeys = keys.length;

    let grid = new PianoRollGrid(keys.length)


    function playNote(note: Note) {
        let oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = note.frequency();
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }

</script>

<style>

    .keyboard {
        display: grid;
    }

    .key {
        border: 1px solid #ccc;
        cursor: pointer;
        margin: 0;
    }

</style>
<div style="display:flex; justify-content: flex-start; align-items: center;">
   <p style="margin-right: 5px;">Time signature:</p>
    <Dropdown options={TimeSignature.allNumerators().map(String)} defaultOption={'4'} bind:selected={timeSignatureNumeratorString} />
    <p style="margin-right: 5px; margin-left: 5px">/</p>
    <Dropdown options={TimeSignature.allDenominators().map(String)} defaultOption={'4'}/>
</div>
<div style="display:flex; justify-content: flex-start; align-items: center;">
    <div class="keyboard" style="grid-template-rows: repeat({numKeys}, {keyHeight}px); margin-right: 5px;">
        {#each reverseKeys as key, keyIndex}
            <button type="button" class="key" style="height: {keyHeight}px; width: 20px; background-color: {pianoColor(key)}"
                on:click={() => playNote(key)}> 
            </button>
        {/each}
    </div>
</div>
