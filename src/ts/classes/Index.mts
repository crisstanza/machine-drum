import { MDPlayer } from "./MDPlayer.mjs";

export class Index {
  private player: MDPlayer;

  constructor() {
    const volumeControl = document.querySelector("input#volume-control") as HTMLInputElement;
    this.player = new MDPlayer(volumeControl);
    this.player.init();
  }

  init() {
    const playButton = document.querySelector("button#play-button");
    playButton?.addEventListener("mousedown", () => this.player.play(playButton));
    const stopButton = document.querySelector("button#stop-button");
    stopButton?.addEventListener("mousedown", () => this.player.stop(playButton));
  }
}
