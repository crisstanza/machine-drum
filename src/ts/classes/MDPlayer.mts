export class MDPlayer {
  private audioContext: AudioContext = new AudioContext();
  private volumeControl: HTMLInputElement;

  private AUDIO_FILES = ["B0", "D1", "Fs1"];
  private AUDIO_BUFFERS: Record<string, AudioBuffer> = {};

  private requestId?: number;
  private position = 0;
  private lastLogTime = 0;

  private bpm = 120;
  private stepDuration = 30 / this.bpm;

  private song = [
    ["Fs1", "B0"], //
    ["Fs1"], //
    ["Fs1", "D1"], //
    ["Fs1"], //

    ["Fs1", "B0"], //
    ["Fs1"], //
    ["Fs1", "D1"], //
    ["Fs1"], //

    ["Fs1", "B0"], //
    ["Fs1"], //
    ["Fs1", "D1"], //
    ["Fs1"], //

    ["Fs1", "B0"], //
    ["Fs1"], //
    ["Fs1", "D1"], //
    ["Fs1"], //

    ["B0"], //
    ["Fs1"], //
    ["Fs1"], //
    ["Fs1"], //

    ["D1"], //
    ["Fs1"], //
    ["Fs1"], //
    ["Fs1"], //

    ["Fs1"], //
    ["Fs1"], //
    ["Fs1"], //
    ["Fs1"], //

    ["B0"], //
    ["B0"], //
    ["B0"], //
    ["B0"], //
  ];

  constructor(volumeControl: HTMLInputElement) {
    this.volumeControl = volumeControl;
  }

  async init() {
    this.AUDIO_FILES.map(async (name) => {
      const response = await fetch(new URL(`audio/${name}.wav`, window.location.href));
      const buffer = await this.audioContext.decodeAudioData(await response.arrayBuffer());
      this.AUDIO_BUFFERS[name] = buffer;
    });
  }

  private async playing(timestamp: number) {
    if (timestamp - this.lastLogTime >= this.stepDuration * 1000) {
      await this.playStep();
      this.lastLogTime = timestamp;
    }
    this.requestId = requestAnimationFrame(this.playing.bind(this));
  }

  private async playStep() {
    await this.audioContext.resume();
    const startTime = this.audioContext.currentTime;
    const step = this.song[this.position];
    const audioBuffers = step.map((name) => this.AUDIO_BUFFERS[name]).filter((buffer) => buffer !== undefined);
    audioBuffers.forEach(async (buffer) => {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = parseFloat(this.volumeControl.value);
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(startTime);
    });
    this.position = (this.position + 1) % this.song.length;
  }

  play(playButton: Element) {
    if (playButton.classList.contains("active")) {
      return;
    }
    playButton.classList.add("active");
    this.requestId = requestAnimationFrame(this.playing.bind(this));
  }

  stop(playButton: Element | null) {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = 0;
      this.position = 0;
      playButton?.classList.remove("active");
    }
  }
}
