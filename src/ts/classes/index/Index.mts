import { MDPlayer } from "../mdplayer/MDPlayer.mjs";

export class Index {
  private readonly volumeControl;
  private readonly playButton;
  private readonly stopButton;

  private readonly songInfo;
  private readonly availableSongs;
  private readonly songDuration;
  private readonly songSpeed;
  private readonly songName;
  private readonly songGenre;
  private readonly songInstruments;
  private readonly songTracks;
  private readonly songRepeat;

  private readonly player;

  constructor() {
    this.volumeControl = document.getElementById("volume-control") as HTMLInputElement;
    this.playButton = document.getElementById("play-button") as HTMLButtonElement;
    this.stopButton = document.getElementById("stop-button") as HTMLButtonElement;

    this.songInfo = document.getElementById("song-info") as HTMLDivElement;
    this.availableSongs = document.getElementById("available-songs") as HTMLSelectElement;
    this.songDuration = document.getElementById("song-duration") as HTMLSpanElement;
    this.songSpeed = document.getElementById("song-speed") as HTMLSpanElement;
    this.songName = document.getElementById("song-name") as HTMLSpanElement;
    this.songGenre = document.getElementById("song-genre") as HTMLSpanElement;
    this.songInstruments = document.getElementById("song-instruments") as HTMLSpanElement;
    this.songTracks = document.getElementById("song-tracks") as HTMLSpanElement;
    this.songRepeat = document.getElementById("song-repeat") as HTMLInputElement;

    this.player = new MDPlayer(
      this.volumeControl, //
      this.playButton,
      this.stopButton,

      this.songInfo,
      this.availableSongs,
      this.songDuration,
      this.songSpeed,
      this.songName,
      this.songGenre,
      this.songInstruments,
      this.songTracks,
      this.songRepeat,
    );
  }

  async init() {
    this.availableSongs.addEventListener("change", () => this.player.songChanged());
    this.songRepeat.addEventListener("change", () => this.player.songRepeatChanged());
    this.playButton.addEventListener("mousedown", () => {
      void this.player.play().catch((error: unknown) => console.error("Could not start audio playback.", error));
    });
    this.stopButton.addEventListener("mousedown", () => this.player.stop());
    await Promise.all([this.player.initAudios(), this.player.initUserInterface()]);
    this.playButton.disabled = false;
  }
}
