<script lang=ts>
    export let options: string[] = [];
    export let defaultOption: string = '';
    export let selected: string = defaultOption;
    let isOpen: boolean = false;
    
    console.log(options)
</script>

<style>

    .dropdown {
        display: flex;
        justify-content: center;
    }

    .dropdown-content {
        position: absolute;
        align-items: center;
        background-color: #f1f1f1;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .dropdown-content button {
        color: black;
        text-decoration: none;
        display: block;
    }

</style>

<div class=dropdown>
{#if isOpen}
<div class="dropdown-content">
    {#each options as option}
        <button type=button on:click={() => {selected = option; isOpen=false}}>
            {option}
        </button>
    {/each}
</div>
{/if}

<button type=button class="dropdown" on:click={() => {isOpen = !isOpen}}>
    {selected}
</button>


</div>

    

