import { MDPlayer } from "./MDPlayer.mjs";

export class Index {
  private player: MDPlayer;

  constructor(player: MDPlayer) {
    this.player = player;
  }

  init() {
    this.player.init();
    const playButton = document.querySelector("button#play-button");
    playButton?.addEventListener("mousedown", () => this.player.play());
    const stopButton = document.querySelector("button#stop-button");
    stopButton?.addEventListener("mousedown", () => this.player.stop());
  }
}
