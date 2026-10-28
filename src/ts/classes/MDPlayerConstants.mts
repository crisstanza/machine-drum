import { MDAudioBufferMap } from "../types/types.mjs";

export abstract class MDPlayerConstants {
  protected readonly audioContext = new AudioContext();
  protected readonly gainNode: GainNode = this.audioContext.createGain();
  protected readonly AUDIO_BUFFERS: MDAudioBufferMap = {};
}
