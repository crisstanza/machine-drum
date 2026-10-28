import { MDPlayer } from "../mdplayer/MDPlayer.mjs";

export class Index {
  private readonly player;
  private readonly playButton: HTMLButtonElement;

  constructor() {
    const volumeControl = document.querySelector("input#volume-control") as HTMLInputElement;
    this.playButton = document.querySelector("button#play-button") as HTMLButtonElement;
    this.player = new MDPlayer(volumeControl, this.playButton);
    this.player.init();
  }

  init() {
    this.playButton?.addEventListener("mousedown", () => this.player.play());
    const stopButton = document.querySelector("button#stop-button");
    stopButton?.addEventListener("mousedown", () => this.player.stop());
  }
}
