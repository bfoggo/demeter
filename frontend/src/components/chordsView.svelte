<script lang="ts">
    import {Settings} from "./musicsettings.svelte";

    let {musicSettings}: {musicSettings: Settings} = $props();
</script>

 <div class="w-2/3 grid grid-cols-12  auto-cols-max grid-flow-row-dense gap-1">
    {#each Array.from({length: musicSettings.complexityPattern.length * musicSettings.measures}, (_, i) => (i)) as measure} 
        <div class="col-span-1 h-9 border-2 border-black">
            </div>
    {/each}
</div>