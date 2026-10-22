export class MDPlayer {
  private AUDIO_FILES = ["B0", "D1", "Fs1"];
  private AUDIO_BUFFERS?: AudioBuffer[];

  private song = [
    ["Fs1", "B0"], //
    ["Fs1"], //
    ["Fs1", "D1"], //
    ["Fs1"], //
  ];

  async init() {
    const audioContext = new AudioContext();
    this.AUDIO_BUFFERS = await Promise.all(
      this.AUDIO_FILES.map(async (name) => {
        const response = await fetch(new URL(`audio/${name}.wav`, window.location.href));
        return audioContext.decodeAudioData(await response.arrayBuffer());
      }),
    );
  }

  async play() {
    const audioContext = new AudioContext();
    await audioContext.resume();
    const startTime = audioContext.currentTime;
    this.AUDIO_BUFFERS?.forEach(async (buffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(startTime);
    });
  }

  stop() {
    console.log("====", this, "stop");
  }
}
