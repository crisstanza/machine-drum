export class MDPlayer {
  private AUDIO_FILES = [1, 2, 3];
  private AUDIO_BUFFERS: AudioBuffer[] = [];

  async init() {
    const audioContext = new AudioContext();
    this.AUDIO_BUFFERS = await Promise.all(
      this.AUDIO_FILES.map(async (number) => {
        const response = await fetch(new URL(`audio/${number}.mp3`, window.location.href));
        return audioContext.decodeAudioData(await response.arrayBuffer());
      }),
    );
  }

  async play() {
    const audioContext = new AudioContext();
    const resume = await audioContext.resume();
    const [buffers] = [this.AUDIO_BUFFERS, resume];
    const startTime = audioContext.currentTime + 0.01;
    buffers.forEach((buffer) => {
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
