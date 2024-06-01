const SAMPLE_RATE = 44100;
const CLIP_BUFFER = 0.01;

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
    
    gain.gain.linearRampToValueAtTime(volume, realStart + CLIP_BUFFER);
    gain.gain.exponentialRampToValueAtTime(0.01 * volume, realStart + decay);
    gain.gain.linearRampToValueAtTime(0, decay + CLIP_BUFFER)
    osc.start(realStart + CLIP_BUFFER);
    osc.stop(realStart + decay + 2*CLIP_BUFFER);

}

const whiteNoiseVector = Array.from({ length: SAMPLE_RATE }, () => Math.random() * 2 - 1);

const whiteNoiseBuffer = (ctx: AudioContext) => {
    const buffer = ctx.createBuffer(1, SAMPLE_RATE, SAMPLE_RATE);
    const data = buffer.getChannelData(0);
    data.set(whiteNoiseVector);
    return buffer;
}

export function highHatSound(start: number, ctx: AudioContext) {
    const decay = 0.2
    const volume = 0.05;

    const noise = ctx.createBufferSource();
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    noise.buffer = whiteNoiseBuffer(ctx);
    noise.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;

    gain.gain.linearRampToValueAtTime(volume, realStart + CLIP_BUFFER);
    gain.gain.exponentialRampToValueAtTime(0.01 * volume, realStart + decay);
    gain.gain.linearRampToValueAtTime(0, decay + CLIP_BUFFER)
    noise.start(realStart);
    noise.stop(realStart + decay + CLIP_BUFFER);
}

export function emptySound(start: number, ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    osc.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;
    
    gain.gain.value = 0;
    osc.start(realStart);
    osc.stop(realStart);
}