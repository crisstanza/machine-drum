import { MDPlayer } from "../mdplayer/MDPlayer.mjs";

export class Index {
  private readonly volumeControl;
  private readonly playButton;
  private readonly pauseButton;
  private readonly stopButton;
  private readonly songProgress;
  private readonly songPosition;

  private readonly songInfo;
  private readonly songInfoDynamic;
  private readonly songDownload;
  private readonly songDownloadLink;

  private readonly availableSongs;
  private readonly songDuration;
  private readonly songName;
  private readonly songGenre;
  private readonly songKey;

  private readonly minus10Button;
  private readonly songSpeed;
  private readonly plus10Button;

  private readonly songTracks;
  private readonly songRepeat;

  private readonly player;

  constructor() {
    this.volumeControl = document.getElementById("volume-control") as HTMLInputElement;
    this.playButton = document.getElementById("play-button") as HTMLButtonElement;
    this.pauseButton = document.getElementById("pause-button") as HTMLButtonElement;
    this.stopButton = document.getElementById("stop-button") as HTMLButtonElement;
    this.songProgress = document.getElementById("song-progress") as HTMLInputElement;
    this.songPosition = document.getElementById("song-position") as HTMLSpanElement;

    this.songInfo = document.getElementById("song-info") as HTMLDivElement;
    this.songInfoDynamic = document.getElementById("song-info-dynamic") as HTMLDivElement;
    this.songDownload = document.getElementById("song-download") as HTMLDivElement;
    this.songDownloadLink = document.getElementById("song-download-link") as HTMLAnchorElement;

    this.availableSongs = document.getElementById("available-songs") as HTMLSelectElement;
    this.songDuration = document.getElementById("song-duration") as HTMLSpanElement;
    this.songName = document.getElementById("song-name") as HTMLSpanElement;
    this.songGenre = document.getElementById("song-genre") as HTMLSpanElement;
    this.songKey = document.getElementById("song-key") as HTMLSpanElement;

    this.minus10Button = document.getElementById("minus-10-button") as HTMLButtonElement;
    this.songSpeed = document.getElementById("song-speed") as HTMLInputElement;
    this.plus10Button = document.getElementById("plus-10-button") as HTMLButtonElement;

    this.songTracks = document.getElementById("song-tracks") as HTMLSpanElement;
    this.songRepeat = document.getElementById("song-repeat") as HTMLInputElement;

    this.player = new MDPlayer(
      this.volumeControl, //
      this.playButton,
      this.pauseButton,
      this.stopButton,
      this.songProgress,
      this.songPosition,

      this.songInfo,
      this.songInfoDynamic,
      this.songDownload,
      this.songDownloadLink,

      this.availableSongs,
      this.songDuration,
      this.songName,
      this.songGenre,
      this.songKey,

      this.minus10Button,
      this.songSpeed,
      this.plus10Button,

      this.songTracks,
      this.songRepeat,
    );
  }

  async init() {
    this.availableSongs.addEventListener("change", () => this.player.songChanged());

    this.minus10Button.addEventListener("mousedown", () => this.player.minus10Bpm());
    this.songSpeed.addEventListener("input", () => this.player.songSpeedChanged());
    this.plus10Button.addEventListener("mousedown", () => this.player.plus10Bpm());

    this.songRepeat.addEventListener("change", () => this.player.songRepeatChanged());

    this.playButton.addEventListener("mousedown", () => this.player.play());
    this.pauseButton.addEventListener("mousedown", () => this.player.pause());
    this.stopButton.addEventListener("mousedown", () => this.player.stop());

    this.songProgress.addEventListener("input", () => this.player.songProgressInput());
    this.songProgress.addEventListener("change", () => this.player.songProgressChanged());

    this.songDownloadLink.addEventListener("click", () => this.player.download());

    this.player.initAudios();
    this.player.initUserInterface();
  }
}
