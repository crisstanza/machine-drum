import { MDPlayer } from "../mdplayer/MDPlayer.mjs";

export class Index {
  private readonly player;
  private readonly playButton: HTMLButtonElement;
  private readonly stopButton: HTMLButtonElement;

  constructor() {
    const volumeControl = document.querySelector("input#volume-control") as HTMLInputElement;
    this.playButton = document.querySelector("button#play-button") as HTMLButtonElement;
    this.stopButton = document.querySelector("button#stop-button") as HTMLButtonElement;
    this.player = new MDPlayer(volumeControl, this.playButton, this.stopButton);
    this.player.init();
  }

  init() {
    this.playButton.addEventListener("mousedown", () => this.player.play());
    this.stopButton.addEventListener("mousedown", () => this.player.stop());
  }
}
