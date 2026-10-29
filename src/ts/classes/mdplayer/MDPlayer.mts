import { AUDIO_FILES } from "../../config/config.mjs";
import { HTML, SONG_NAMES } from "../../enums/enums.mjs";
import { MDSong } from "../../types/types.mjs";
import { MDPlayerConstants } from "./MDPlayerConstants.mjs";

export class MDPlayer extends MDPlayerConstants {
  private requestId = 0;
  private timeControl = 0;

  private activeSources = 0;
  private partIndex = 0;
  private beatIndex = 0;
  private positionIndex = 0;

  private partCount = 0;
  private beatCount = 0;

  private stepDuration = 0;

  private song?: MDSong;

  private calcStepDuration(song: MDSong) {
    return (1000 * 60) / (song.time * song.bpm * 2);
  }

  async init() {
    AUDIO_FILES.map(async (name) => {
      const response = await fetch(new URL(`audio/${name}.wav`, window.location.href));
      const buffer = await this.audioContext.decodeAudioData(await response.arrayBuffer());
      this.AUDIO_BUFFERS[name] = buffer;
    });
    this.gainNode.connect(this.audioContext.destination);

    for (let i = 0; i <= 9; i++) {
      try {
        const module = (await import(`../../songs/song-${i.toString().padStart(2, "0")}.mjs`)) as Record<string, MDSong>;
        Object.keys(module).forEach((exportedObject) => this.songs.push(module[exportedObject]));
      } catch (exc) {
        console.info("End of songs loading.");
      }
    }

    this.availableSongs.options.length = 0;
    this.songs.forEach((song, i) => {
      const newOption = document.createElement("option");
      newOption.value = i.toString();
      newOption.text = `${song.name ?? SONG_NAMES._} (${song.gender})`;
      this.availableSongs.add(newOption);
    });
    this.songChanged();

    this.playButton.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
  }

  private async playing(timestamp: number) {
    if (timestamp - this.timeControl >= this.stepDuration) {
      await this.playStep();
      this.timeControl = timestamp;
    }
    if (this.isPlaying()) {
      this.requestId = requestAnimationFrame(this.playing.bind(this));
    }
  }

  private moveToNextPart() {
    this.partIndex++;
    this.partCount = 0;
    this.beatIndex = 0;
    this.beatCount = 0;
    this.positionIndex = 0;
    if (this.partIndex >= this.song!.data.parts.length && this.song!.repeat) {
      this.partIndex = 0;
    }
  }

  private skipBeatGroup(part: MDSong["data"]["parts"][number]) {
    this.beatIndex++;
    this.beatCount = 0;
    this.positionIndex = 0;
    if (this.beatIndex >= part.beats.length) {
      this.beatIndex = 0;
      this.partCount++;
      if (this.partCount >= part.repeat) {
        this.moveToNextPart();
      }
    }
  }

  private async playStep() {
    const parts = this.song!.data.parts;
    let skippedPartCount = 0;
    let part = parts[this.partIndex];
    let beats = part?.beats[this.beatIndex];
    while (true) {
      if (this.partIndex >= parts.length) {
        this.stop();
        return;
      }
      part = parts[this.partIndex];
      if (!part) {
        this.stop();
        return;
      }
      if (!part.repeat || part.repeat < 1 || !part.beats.some((group) => group.repeat >= 1 && group.data.length > 0)) {
        skippedPartCount++;
        if (skippedPartCount >= parts.length) {
          this.stop();
          return;
        }
        this.moveToNextPart();
        continue;
      }
      skippedPartCount = 0;
      beats = part.beats[this.beatIndex];
      if (!beats || !beats.repeat || beats.repeat < 1 || beats.data.length < 1) {
        this.skipBeatGroup(part);
        continue;
      }
      break;
    }
    await this.audioContext.resume();
    const step = beats.data[this.positionIndex];
    this.positionIndex++;
    if (this.positionIndex >= beats.data.length) {
      this.beatCount++;
      if (this.beatCount >= beats.repeat) {
        this.beatIndex++;
        this.beatCount = 0;
        if (this.beatIndex >= part.beats.length) {
          this.beatIndex = 0;
          this.partCount++;
          if (this.partCount >= part.repeat) {
            this.moveToNextPart();
          }
        }
      }
      this.positionIndex = 0;
    }
    const audioBuffers = step //
      .filter((name) => name != "")
      .map((name) => this.AUDIO_BUFFERS[name]);
    audioBuffers.forEach(async (buffer) => {
      const source: AudioBufferSourceNode = this.audioContext.createBufferSource();
      source.buffer = buffer;
      this.gainNode.gain.value = parseFloat(this.volumeControl.value);
      source.connect(this.gainNode);
      source.start();
      this.activeSources++;
      source.addEventListener("ended", (evt: Event) => {
        const target = evt.target as AudioBufferSourceNode;
        target.disconnect();
        this.activeSources--;
        if (!this.isPlaying()) {
          if (this.activeSources == 0) {
            this.audioContext.suspend();
          }
        }
      });
    });
  }

  private isPlaying() {
    return this.playButton.classList.contains(HTML.CLASS_NAMES.ACTIVE);
  }

  play() {
    if (this.isPlaying()) {
      return;
    }
    this.playButton.classList.add(HTML.CLASS_NAMES.ACTIVE);
    this.stopButton.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
    this.availableSongs.setAttribute(HTML.ATTRIBUTE_NAMES.DISABLED, "");
    this.requestId = requestAnimationFrame(this.playing.bind(this));
  }

  stop() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = 0;
      this.partIndex = 0;
      this.beatIndex = 0;
      this.positionIndex = 0;
      this.partCount = 0;
      this.beatCount = 0;
      this.playButton.classList.remove(HTML.CLASS_NAMES.ACTIVE);
      this.stopButton.setAttribute(HTML.ATTRIBUTE_NAMES.DISABLED, "");
      this.availableSongs.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
    }
  }

  songRepeatChanged() {
    if (this.song) {
      this.song.repeat = this.songRepeat.checked;
    }
  }

  songChanged() {
    this.song = this.songs[this.availableSongs.selectedIndex];
    this.stepDuration = this.calcStepDuration(this.song);
    this.songSpeed.innerText = this.song.bpm.toString();
    this.songName.innerText = this.song.name ?? SONG_NAMES._;
    this.songGenre.innerText = this.song.gender;
    this.songRepeat.checked = this.song.repeat ?? false;
    this.availableSongs.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
  }
}
