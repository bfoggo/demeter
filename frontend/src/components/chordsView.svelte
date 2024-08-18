<script lang="ts">
    import {Settings} from "./musicsettings.svelte";

    let {musicSettings}: {musicSettings: Settings} = $props();
</script>

 <div class="grid grid-cols-16 items-center gap-1">
    {#each Array.from({length: musicSettings.measures}, (_, i) => (i)) as measure} 
        <div class="h-36 w-36 border-2 border-black">
            </div>
    {/each}
</div>