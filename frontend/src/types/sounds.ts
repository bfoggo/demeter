const SAMPLE_RATE = 44100;

export interface Stoppable {
    stop: () => void;
}

export function kickSound(start: number, ctx: AudioContext): Stoppable {

    const decay = 0.3;
    const volume = 1;
    const attack = 0.01;
    const sustain = 0.01;
    const release = 0.05;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    osc.frequency.value = 55;
    osc.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;
    
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(volume, realStart + attack);
    gain.gain.exponentialRampToValueAtTime(sustain * volume, realStart + attack + decay);
    gain.gain.linearRampToValueAtTime(0, realStart + attack + decay + release);
    osc.start(realStart);
    osc.stop(realStart + attack + decay + release);

    return osc as Stoppable;
}

const whiteNoiseVector = Array.from({ length: SAMPLE_RATE }, () => Math.random() * 2 - 1);

const whiteNoiseBuffer = (ctx: AudioContext) => {
    const buffer = ctx.createBuffer(1, SAMPLE_RATE, SAMPLE_RATE);
    const data = buffer.getChannelData(0);
    data.set(whiteNoiseVector);
    return buffer;
}

export function highHatSound(start: number, ctx: AudioContext): Stoppable {
    const decay = 0.2
    const volume = 0.05;
    const attack = 0.02;
    const sustain = 0.05;
    const release = 0.01;

    const noise = ctx.createBufferSource();
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    noise.buffer = whiteNoiseBuffer(ctx);
    noise.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;

    gain.gain.value = 0
    gain.gain.linearRampToValueAtTime(volume, realStart + attack);
    gain.gain.exponentialRampToValueAtTime(sustain * volume, realStart + attack + decay);
    gain.gain.linearRampToValueAtTime(0, realStart + attack + decay + release);
    noise.start(realStart);
    noise.stop(realStart + decay + attack + release);

    return noise as Stoppable;
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