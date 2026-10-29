import { MDPlayer } from "../mdplayer/MDPlayer.mjs";

export class Index {
  private readonly player;
  private readonly playButton;
  private readonly stopButton;
  private readonly availableSongs;
  private readonly songSpeed;
  private readonly songName;
  private readonly songGenre;
  private readonly songRepeat;

  constructor() {
    const volumeControl = document.querySelector("input#volume-control") as HTMLInputElement;
    this.playButton = document.querySelector("button#play-button") as HTMLButtonElement;
    this.stopButton = document.querySelector("button#stop-button") as HTMLButtonElement;
    this.availableSongs = document.querySelector("select#available-songs") as HTMLSelectElement;
    this.songSpeed = document.querySelector("span#song-speed") as HTMLSpanElement;
    this.songName = document.querySelector("span#song-name") as HTMLSpanElement;
    this.songGenre = document.querySelector("span#song-genre") as HTMLSpanElement;
    this.songRepeat = document.querySelector("input#song-repeat") as HTMLInputElement;
    this.player = new MDPlayer(
      volumeControl, //
      this.playButton,
      this.stopButton,
      this.availableSongs,
      this.songSpeed,
      this.songName,
      this.songGenre,
      this.songRepeat,
    );
    this.player.init();
  }

  init() {
    this.availableSongs.addEventListener("change", () => this.player.songChanged());
    this.songRepeat.addEventListener("change", () => this.player.songRepeatChanged());
    this.playButton.addEventListener("mousedown", () => this.player.play());
    this.stopButton.addEventListener("mousedown", () => this.player.stop());
  }
}
