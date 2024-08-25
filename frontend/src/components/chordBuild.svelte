<script lang="ts">
    import type { ChordGrammar, NoteNameSharp } from "../types/note";

    let {
        builtChord = $bindable(),
    }: { builtChord: ChordGrammar,
     } = $props();

     function setRoot(note: NoteNameSharp) {
        const oldChord = $state.snapshot(builtChord);
        builtChord = {
            ...oldChord,
            root: { noteSet: "sharps", name: note },
        };
     }



</script>

<div class="flex divide-x-1">
    <div class="flex-col ml-4">
        <div class="text-gray-500 text-left"><span>Root</span></div>
        {#each ["C", "D", "E", "F", "G", "A", "B"] as note}
            <div>
                <button
                    class="w-9 border-2 border-gray-200 text-center hover:bg-gray-200"
                    style="background: {note === builtChord.root.name
                        ? 'gray'
                        : 'white'}"
                    onclick={() => {
                        setRoot(note as NoteNameSharp);
                    }}>{note}</button
                >
            </div>
        {/each}
    </div>
</div>
