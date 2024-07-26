<script lang="ts">
    import { NoteName, pianoRollColor, flatstr } from "../types/note";
    let center = [192, 192];
    let numWedges = 12;
    let wedgeAngle = (2 * Math.PI) / numWedges;

    function newPointSet(radius: number, offset: number = 0) {
        let wedgePoints = Array.from({ length: numWedges }, (_, i) => {
            let angleoffset = ((-15 + offset) * Math.PI) / 180;
            let angle = i * wedgeAngle;
            let x = center[0] + radius * Math.cos(angle + angleoffset);
            let y = center[1] - radius * Math.sin(angle + angleoffset);
            return [x, y];
        });
        return wedgePoints;
    }

    let outerRadius = 192;
    let innerRadius = 100;
    let halfRadius = (outerRadius + innerRadius) / 2;
    let outerWedgePoints = newPointSet(outerRadius);
    let innerWedgePoints = newPointSet(innerRadius);
    let halfWedgePoints = newPointSet(halfRadius, 15);

    let noteNames = [
        NoteName.A,
        NoteName.D,
        NoteName.G,
        NoteName.C,
        NoteName.F,
        NoteName.ASharp,
        NoteName.DSharp,
        NoteName.GSharp,
        NoteName.CSharp,
        NoteName.FSharp,
        NoteName.B,
        NoteName.E,
    ];

    let currentHoveredNote: string | null = null;
    let currentSelectedNote: NoteName = NoteName.C;
    function setHoveredNoteName(noteName: NoteName | null) {
        if (noteName === null) {
            currentHoveredNote = null;
            return;
        }
        currentHoveredNote = flatstr(noteName);
    }
    function setSelectedNoteName(noteName: NoteName) {
        currentSelectedNote = noteName;
        setHoveredNoteName(null);
    }
</script>

<div class="border-2 rounded-full w-96 h-96 m-auto overflow-hidden">
    <div class="relative w-full h-full">
        <svg width="384" height="384" xmlns="http://www.w3.org/2000/svg">
            {#each Array.from({ length: numWedges }, (_, i) => i) as i}
                <path
                    d={` 
                    M ${innerWedgePoints[i][0]} ${innerWedgePoints[i][1]}
                    L ${outerWedgePoints[i][0]} ${outerWedgePoints[i][1]}
                    A ${outerRadius} ${outerRadius} 0 0 0 ${outerWedgePoints[(i + 1) % numWedges][0]} ${outerWedgePoints[(i + 1) % numWedges][1]}
                    L ${innerWedgePoints[(i + 1) % numWedges][0]} ${innerWedgePoints[(i + 1) % numWedges][1]}
                    A ${innerRadius} ${innerRadius} 0 0 1 ${innerWedgePoints[i][0]} ${innerWedgePoints[i][1]}
                    `}
                    fill={pianoRollColor(noteNames[i]).toString()}
                    role="button"
                    tabindex="0"
                    on:mouseenter={() => setHoveredNoteName(noteNames[i])}
                    on:focus={() => setHoveredNoteName(noteNames[i])}
                    on:click={() => setSelectedNoteName(noteNames[i])}
                    on:keydown={(e) => {
                        if (e.key === "Enter") {
                            setSelectedNoteName(noteNames[i]);
                        }
                    }}
                    on:mouseleave={() => setHoveredNoteName(null)}
                />
                <text
                    x={halfWedgePoints[i][0]}
                    y={halfWedgePoints[i][1]}
                    fill="black"
                    font-size="12"
                    text-anchor="middle"
                >
                    {flatstr(noteNames[i])}
                </text>
            {/each}
        </svg>
        {#if currentHoveredNote}
            <div
                class="absolute left-1/2 top-1/2 text-3xl transform -translate-x-1/2 -translate-y-1/2 font-serif"
            >
                {currentHoveredNote}
            </div>
        {:else}
            <div
                class="absolute left-1/2 top-1/2 text-5xl transform -translate-x-1/2 -translate-y-1/2 font-serif font-extrabold"
            >
                {flatstr(currentSelectedNote)}
            </div>
        {/if}
    </div>
</div>

<style>
    svg {
        position: absolute;
        top: 0;
        left: 0;
    }
    path:hover {
        cursor: pointer;
        opacity: 0.2;
        transition: opacity 0.2s;
    }
    text {
        z-index: -1;
        pointer-events: none;
    }
</style>
