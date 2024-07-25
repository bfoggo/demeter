<script lang="ts">
    import { NoteName, pianoRollColor } from "../types/note";
    let center = [192, 192];
    let numWedges = 12;
    let wedgeAngle = (2 * Math.PI) / numWedges;

    function newPointSet(radius: number) {
        let wedgePoints = Array.from({ length: numWedges }, (_, i) => {
            let angleoffset = (-15 * Math.PI) / 180;
            let angle = i * wedgeAngle;
            let x = center[0] + radius * Math.cos(angle + angleoffset);
            let y = center[1] - radius * Math.sin(angle + angleoffset);
            return [x, y];
        });
        return wedgePoints;
    }

    let outerRadius = 192;
    let innerRadius = 70;
    let outerWedgePoints = newPointSet(outerRadius);
    let innerWedgePoints = newPointSet(innerRadius);

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
</script>

<div class="border-2 rounded-full w-96 h-96 m-auto overflow-hidden">
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
                fill={pianoRollColor(noteNames[i])}
            />
        {/each}
    </svg>
    <p class="aboslute left-50% top-50%">Placeholder</p>
</div>

<style>
    path:hover {
        cursor: pointer;
        opacity: 0.5;
    }
</style>
