import { MDAudioBufferMapMap, MDSong, MDSongDataTrackState } from "../../types/types.mjs";

export abstract class MDPlayerConstants {
  protected readonly volumeControl;
  protected readonly playButton;
  protected readonly pauseButton;
  protected readonly stopButton;
  protected readonly songProgress;

  protected readonly songInfo;
  protected readonly songInfoDynamic;
  protected readonly songDownload;
  protected readonly songDownloadLink;

  protected readonly availableSongs;
  protected readonly songDuration;
  protected readonly songSpeed;
  protected readonly songName;
  protected readonly songGenre;
  protected readonly songInstruments;
  protected readonly songTracks;
  protected readonly songRepeat;

  protected readonly audioContext = new AudioContext({ sampleRate: 44_100 });
  protected readonly gainNode: GainNode = this.audioContext.createGain();
  protected readonly AUDIO_BUFFERS: MDAudioBufferMapMap = {
    drums: {},
    bass: {},
    "guitar-clean": {},
  };
  protected readonly songs: MDSong[] = [];

  protected readonly trackGainNodes: GainNode[] = [];
  protected readonly noteFadeOutDuration = 0.03;
  protected readonly bassVoices = new Map<AudioBufferSourceNode, GainNode>();
  protected readonly guitarCleanVoices = new Map<AudioBufferSourceNode, GainNode>();
  protected readonly trackStates: MDSongDataTrackState[] = [];

  constructor(
    volumeControl: HTMLInputElement, //
    playButton: HTMLButtonElement,
    pauseButton: HTMLButtonElement,
    stopButton: HTMLButtonElement,
    songProgress: HTMLInputElement,

    songInfo: HTMLDivElement,
    songInfoDynamic: HTMLDivElement,
    songDownload: HTMLDivElement,
    songDownloadLink: HTMLAnchorElement,

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
    this.pauseButton = pauseButton;
    this.stopButton = stopButton;
    this.songProgress = songProgress;

    this.songInfo = songInfo;
    this.songInfoDynamic = songInfoDynamic;
    this.songDownload = songDownload;
    this.songDownloadLink = songDownloadLink;

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
