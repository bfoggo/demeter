const SAMPLE_RATE = 44100;

export interface Stoppable {
    stop: () => void;
}

export const noteBlipSound = (start: number, frequency: number, ctx: AudioContext) => singleOscSound(start, frequency, ctx, blipADSR(0.2), 'triangle');
export const kickSound = (start: number, ctx: AudioContext) => singleOscSound(start, 50, ctx, thumpADSR(1.0), 'triangle');
export const snareSound = (start: number, ctx: AudioContext) => singleBufferSound(start, whiteNoiseBuffer(ctx), ctx, rattleADSR(0.05));
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

export class ADSR {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    volume: number;

    constructor(attack: number, decay: number, sustain: number, release: number, volume: number) {
        this.attack = attack;
        this.decay = decay;
        this.sustain = sustain;
        this.release = release;
        this.volume = volume;
    }
}

const blipADSR = (volume: number) => new ADSR(0.01, 0.2, 0.01, 0.05, volume);
const thumpADSR = (volume: number) => new ADSR(0.01, 0.3, 0.01, 0.05, volume);
const rattleADSR = (volume: number) => new ADSR(0.02, 0.2, 0.05, 0.01, volume);

function singleOscSound(start: number, frequency: number, ctx: AudioContext, adsr: ADSR, osc_type: OscillatorType): Stoppable {
    const osc = ctx.createOscillator();
    osc.type = osc_type;
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(adsr.volume, realStart + adsr.attack);
    gain.gain.exponentialRampToValueAtTime(adsr.sustain * adsr.volume, realStart + adsr.attack + adsr.decay);
    gain.gain.linearRampToValueAtTime(0, realStart + adsr.attack + adsr.decay + adsr.release);
    osc.start(realStart);
    osc.stop(realStart + adsr.attack + adsr.decay + adsr.release);

    return osc as Stoppable;
}

function singleBufferSound(start: number, buffer: AudioBuffer, ctx: AudioContext, adsr: ADSR): Stoppable {
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    const current_time = ctx.currentTime;
    source.buffer = whiteNoiseBuffer(ctx);
    source.connect(gain);
    gain.connect(ctx.destination);

    let realStart = start + current_time;

    gain.gain.value = 0
    gain.gain.linearRampToValueAtTime(adsr.volume, realStart + adsr.attack);
    gain.gain.exponentialRampToValueAtTime(adsr.sustain * adsr.volume, realStart + adsr.attack + adsr.decay);
    gain.gain.linearRampToValueAtTime(0, realStart + adsr.attack + adsr.decay + adsr.release);
    source.start(realStart);
    source.stop(realStart + adsr.decay + adsr.attack + adsr.release);

    return source as Stoppable;
}
const whiteNoiseBuffer = (ctx: AudioContext) => {
    const buffer = ctx.createBuffer(1, SAMPLE_RATE, SAMPLE_RATE);
    const data = buffer.getChannelData(0);
    const whiteNoiseVector = Array.from({ length: SAMPLE_RATE }, () => Math.random() * 2 - 1);
    data.set(whiteNoiseVector);
    return buffer;
}