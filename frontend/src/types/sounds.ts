export function kickSound(start: number, ctx: AudioContext) {

    const decay = 0.5;
    const volume = 1;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    osc.frequency.value = 50;
    osc.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;
    
    gain.gain.linearRampToValueAtTime(volume, realStart + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01 * volume, realStart + decay);
    gain.gain.linearRampToValueAtTime(0, decay + 0.1)
    osc.start(realStart);
    osc.stop(realStart + decay + 0.1);

}