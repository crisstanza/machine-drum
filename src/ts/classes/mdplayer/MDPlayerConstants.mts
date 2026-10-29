import { MDAudioBufferMap, MDSong } from "../../types/types.mjs";

export abstract class MDPlayerConstants {
  protected readonly volumeControl;
  protected readonly playButton;
  protected readonly stopButton;
  protected readonly availableSongs;
  protected readonly songSpeed;
  protected readonly songName;
  protected readonly songGenre;
  protected readonly songRepeat;

  protected readonly audioContext = new AudioContext();
  protected readonly gainNode: GainNode = this.audioContext.createGain();
  protected readonly AUDIO_BUFFERS: MDAudioBufferMap = {};
  protected readonly songs: MDSong[] = [];

  constructor(
    volumeControl: HTMLInputElement, //
    playButton: HTMLButtonElement,
    stopButton: HTMLButtonElement,
    availableSongs: HTMLSelectElement,
    songSpeed: HTMLSpanElement,
    songName: HTMLSpanElement,
    songGenre: HTMLSpanElement,
    songRepeat: HTMLInputElement,
  ) {
    this.volumeControl = volumeControl;
    this.playButton = playButton;
    this.stopButton = stopButton;
    this.availableSongs = availableSongs;
    this.songSpeed = songSpeed;
    this.songName = songName;
    this.songGenre = songGenre;
    this.songRepeat = songRepeat;
  }
}
