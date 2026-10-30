import { MDAudioBufferMapMap, MDSong, MDSongDataTrackState } from "../../types/types.mjs";

export abstract class MDPlayerConstants {
  protected readonly volumeControl;
  protected readonly playButton;
  protected readonly stopButton;

  protected readonly songInfo;
  protected readonly availableSongs;
  protected readonly songDuration;
  protected readonly songSpeed;
  protected readonly songName;
  protected readonly songGenre;
  protected readonly songInstruments;
  protected readonly songTracks;
  protected readonly songRepeat;

  protected readonly audioContext = new AudioContext();
  protected readonly gainNode: GainNode = this.audioContext.createGain();
  protected readonly AUDIO_BUFFERS: MDAudioBufferMapMap = {
    drums: {},
    bass: {},
    guitar: {},
  };
  protected readonly songs: MDSong[] = [];

  protected readonly trackGainNodes: GainNode[] = [];
  protected readonly bassFadeOutDuration = 0.03;
  protected readonly bassVoices = new Map<AudioBufferSourceNode, GainNode>();
  protected readonly trackStates: MDSongDataTrackState[] = [];

  constructor(
    volumeControl: HTMLInputElement, //
    playButton: HTMLButtonElement,
    stopButton: HTMLButtonElement,
    songInfo: HTMLDivElement,
    availableSongs: HTMLSelectElement,
    songDuration: HTMLSpanElement,
    songSpeed: HTMLSpanElement,
    songName: HTMLSpanElement,
    songGenre: HTMLSpanElement,
    songInstruments: HTMLSpanElement,
    songTracks: HTMLSpanElement,
    songRepeat: HTMLInputElement,
  ) {
    this.volumeControl = volumeControl;
    this.playButton = playButton;
    this.stopButton = stopButton;

    this.songInfo = songInfo;
    this.availableSongs = availableSongs;
    this.songDuration = songDuration;
    this.songSpeed = songSpeed;
    this.songName = songName;
    this.songGenre = songGenre;
    this.songInstruments = songInstruments;
    this.songTracks = songTracks;
    this.songRepeat = songRepeat;
  }
}
