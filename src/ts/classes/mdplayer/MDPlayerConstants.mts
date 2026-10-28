import { MDAudioBufferMap } from "../../types/types.mjs";

export abstract class MDPlayerConstants {
  protected readonly volumeControl: HTMLInputElement;
  protected readonly playButton: HTMLButtonElement;
  protected readonly stopButton: HTMLButtonElement;
  protected readonly audioContext = new AudioContext();
  protected readonly gainNode: GainNode = this.audioContext.createGain();
  protected readonly AUDIO_BUFFERS: MDAudioBufferMap = {};

  constructor(volumeControl: HTMLInputElement, playButton: HTMLButtonElement, stopButton: HTMLButtonElement) {
    this.volumeControl = volumeControl;
    this.playButton = playButton;
    this.stopButton = stopButton;
  }
}
