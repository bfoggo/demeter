const SAMPLE_RATE = 44100;

export function kickSound(start: number, ctx: AudioContext) {

    const decay = 0.5;
    const volume = 1;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    osc.frequency.value = 55;
    osc.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;
    
    gain.gain.linearRampToValueAtTime(volume, realStart + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01 * volume, realStart + decay);
    gain.gain.linearRampToValueAtTime(0, decay + 0.1)
    osc.start(realStart);
    osc.stop(realStart + decay + 0.1);

}

const whiteNoiseVector = Array.from({ length: SAMPLE_RATE }, () => Math.random() * 2 - 1);

const whiteNoiseBuffer = (ctx: AudioContext) => {
    const buffer = ctx.createBuffer(1, SAMPLE_RATE, SAMPLE_RATE);
    const data = buffer.getChannelData(0);
    data.set(whiteNoiseVector);
    return buffer;
}

export function highHatSound(start: number, ctx: AudioContext) {
    const decay = 0.1;
    const volume = 0.05;

    const noise = ctx.createBufferSource();
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    noise.buffer = whiteNoiseBuffer(ctx);
    noise.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;

    gain.gain.linearRampToValueAtTime(volume, realStart + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01 * volume, realStart + decay);
    gain.gain.linearRampToValueAtTime(0, decay + 0.1)
    noise.start(realStart);
    noise.stop(realStart + decay + 0.1);
}