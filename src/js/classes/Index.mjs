export class Index {
    constructor(player) {
        this.player = player;
    }
    init() {
        this.player.init();
        const playButton = document.querySelector("button#play-button");
        playButton === null || playButton === void 0 ? void 0 : playButton.addEventListener("click", () => this.player.play());
        const stopButton = document.querySelector("button#stop-button");
        stopButton === null || stopButton === void 0 ? void 0 : stopButton.addEventListener("click", () => this.player.stop());
    }
}
