import { MDAudioBufferMap, MDSong } from "../types/types.mjs";

export class MDPlayer {
  private readonly audioContext = new AudioContext();
  private readonly gainNode: GainNode = this.audioContext.createGain();

  private readonly volumeControl: HTMLInputElement;

  private readonly AUDIO_FILES = [
    "B0",
    "C1",
    "Cs1",
    "D1",
    "Ds1",
    "E1",
    "F1",
    "Fs1",
    "G1",
    "Gs1",
    "A1",
    "As1",
    "B1",
    "C2",
    "Cs2",
    "D2",
    "Ds2",
    "E2",
    "F2",
    "Fs2",
    "G2", // empty
    "Gs2",
    "A2",
    "As2", // empty
    "B2",
  ];
  private readonly AUDIO_BUFFERS: MDAudioBufferMap = {};

  private requestId = 0;
  private timeControl = 0;

  private beatIndex = 0;
  private positionIndex = 0;
  private beatCount = 0;

  private bpm = 120;
  private stepDuration = (1000 * 60) / (4 * this.bpm);

  private readonly song: MDSong = [
    {
      beats: [
        ["A2", "Fs1", "B0"], //
        [""],
        ["Fs1"],
        [""],
        ["Fs1", "D1"],
        [""],
        ["Fs1"],
        [""],
      ],
      repeat: 1,
    },
    {
      beats: [
        ["Fs1", "B0"], //
        [""],
        ["Fs1"],
        [""],
        ["Fs1", "D1"],
        [""],
        ["Fs1"],
        [""],
      ],
      repeat: 3,
    },
  ];

  constructor(volumeControl: HTMLInputElement) {
    this.volumeControl = volumeControl;
    this.gainNode.connect(this.audioContext.destination);
  }

  async init() {
    this.AUDIO_FILES.map(async (name) => {
      const response = await fetch(new URL(`audio/${name}.wav`, window.location.href));
      const buffer = await this.audioContext.decodeAudioData(await response.arrayBuffer());
      this.AUDIO_BUFFERS[name] = buffer;
    });
  }

  private async playing(timestamp: number) {
    if (timestamp - this.timeControl >= this.stepDuration) {
      this.playStep();
      this.timeControl = timestamp;
    }
    this.requestId = requestAnimationFrame(this.playing.bind(this));
  }

  private async playStep() {
    await this.audioContext.resume();
    let beats = this.song[this.beatIndex];
    let tryNumber = 1;
    while (!beats || beats.repeat < 1) {
      this.beatIndex = (this.beatIndex + 1) % this.song.length;
      this.positionIndex = 0;
      this.beatCount = 0;
      beats = this.song[this.beatIndex];
      tryNumber++;
      if (tryNumber > this.song.length) {
        this.stop(document.getElementById("play-button"));
        return;
      }
    }
    const step = beats.beats[this.positionIndex];
    this.positionIndex++;
    if (this.positionIndex >= beats.beats.length) {
      if (++this.beatCount >= beats.repeat) {
        this.beatIndex = (this.beatIndex + 1) % this.song.length;
        this.beatCount = 0;
      }
      this.positionIndex = 0;
    }

    const audioBuffers = step.filter((name) => name != "").map((name) => this.AUDIO_BUFFERS[name]);
    audioBuffers.forEach(async (buffer) => {
      const source: AudioBufferSourceNode = this.audioContext.createBufferSource();
      source.buffer = buffer;
      this.gainNode.gain.value = parseFloat(this.volumeControl.value);
      source.connect(this.gainNode);
      source.start();
      source.addEventListener("ended", (evt: Event) => {
        const target = evt.target as AudioBufferSourceNode;
        target.disconnect();
      });
    });
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
      this.beatIndex = 0;
      this.positionIndex = 0;
      this.beatCount = 0;
      this.audioContext.suspend();
      playButton?.classList.remove("active");
    }
  }
}
