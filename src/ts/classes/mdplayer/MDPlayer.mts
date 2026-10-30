import { BASS_AUDIO_FILES, DRUMS_AUDIO_FILES } from "../../config/config.mjs";
import { HTML, INSTRUMENTS, SONG_NAMES } from "../../enums/enums.mjs";
import { MDSong, MDSongDataTrack, MDSongDataTrackPart, MDSongMap } from "../../types/types.mjs";
import { MDPlayerConstants } from "./MDPlayerConstants.mjs";

type MDSongDataTrackState = {
  partIndex: number;
  beatIndex: number;
  positionIndex: number;
  partCount: number;
  beatCount: number;
  finished: boolean;
};

export class MDPlayer extends MDPlayerConstants {
  private readonly bassFadeOutDuration = 0.03;
  private requestId = 0;
  private timeControl = 0;

  private activeSources = 0;
  private bassVoices = new Map<AudioBufferSourceNode, GainNode>();
  private trackStates: MDSongDataTrackState[] = [];

  private beatInterval = 0;

  private song?: MDSong;

  private hasPlayableData(track: MDSongDataTrack) {
    return track.parts.some((part) => part.repeat >= 1 && part.beats.some((beat) => beat.repeat >= 1 && beat.data.length > 0));
  }

  private resetTrackStates() {
    this.trackStates = this.song!.data.tracks.map(() => ({
      partIndex: 0,
      beatIndex: 0,
      positionIndex: 0,
      partCount: 0,
      beatCount: 0,
      finished: false,
    }));
  }

  private calcBeatInterval(song: MDSong) {
    return (1000 * 60) / (song.time * song.bpm * 2);
  }

  private calcSongInstruments(song: MDSong) {
    return [...new Set(song.data.tracks.map((track) => track.instrument))].join(", ");
  }

  private calcSongDuration(song: MDSong) {
    const trackSteps = song.data.tracks.map((track) =>
      track.parts.reduce((partTotal, part) => {
        if (part.repeat < 1 || !part.beats.some((beat) => beat.repeat >= 1 && beat.data.length > 0)) {
          return partTotal;
        }
        const partSteps = part.beats.reduce((beatTotal, beat) => {
          if (beat.repeat < 1 || beat.data.length < 1) {
            return beatTotal;
          }
          return beatTotal + beat.data.length * Math.ceil(beat.repeat);
        }, 0);
        return partTotal + partSteps * Math.ceil(part.repeat);
      }, 0),
    );
    const steps = Math.max(0, ...trackSteps);
    const durationInSeconds = Math.floor((steps * this.calcBeatInterval(song)) / 1000);
    const minutes = Math.floor(durationInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (durationInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  async initAudios() {
    DRUMS_AUDIO_FILES.map(async (name) => {
      const response = await fetch(new URL(`audio/${INSTRUMENTS.DRUMS}/${name}.wav`, window.location.href));
      const buffer = await this.audioContext.decodeAudioData(await response.arrayBuffer());
      this.AUDIO_BUFFERS[INSTRUMENTS.DRUMS][name] = buffer;
    });
    BASS_AUDIO_FILES.map(async (name) => {
      const response = await fetch(new URL(`audio/${INSTRUMENTS.BASS}/${name}.wav`, window.location.href));
      const buffer = await this.audioContext.decodeAudioData(await response.arrayBuffer());
      this.AUDIO_BUFFERS[INSTRUMENTS.BASS][name] = buffer;
    });
    this.gainNode.connect(this.audioContext.destination);
  }

  async initUserInterface() {
    for (let i = 0; i <= 99; i++) {
      try {
        const module = (await import(`../../songs/song-${i.toString().padStart(2, "0")}.mjs`)) as MDSongMap;
        Object.keys(module).forEach((exportedObject) => this.songs.push(module[exportedObject]));
      } catch (exc) {
        console.info(`End of songs loading. Total: ${this.songs.length}.`);
        break;
      }
    }
    this.availableSongs.options.length = 0;
    this.songs.forEach((song, i) => {
      const newOption = document.createElement("option");
      newOption.value = i.toString();
      newOption.text = `${song.name ?? SONG_NAMES._} | ${song.gender}`;
      this.availableSongs.add(newOption);
    });
    this.songChanged();
    this.playButton.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
  }

  private async playing(timestamp: number) {
    if (timestamp - this.timeControl >= this.beatInterval) {
      await this.playStep();
      this.timeControl = timestamp;
    }
    if (this.isPlaying()) {
      this.requestId = requestAnimationFrame(this.playing.bind(this));
    }
  }

  private moveToNextPart(track: MDSongDataTrack, state: MDSongDataTrackState) {
    state.partIndex++;
    state.partCount = 0;
    state.beatIndex = 0;
    state.beatCount = 0;
    state.positionIndex = 0;
    if (state.partIndex >= track.parts.length) {
      state.finished = true;
    }
  }

  private skipBeatGroup(track: MDSongDataTrack, part: MDSongDataTrackPart, state: MDSongDataTrackState) {
    state.beatIndex++;
    state.beatCount = 0;
    state.positionIndex = 0;
    if (state.beatIndex >= part.beats.length) {
      state.beatIndex = 0;
      state.partCount++;
      if (state.partCount >= part.repeat) {
        this.moveToNextPart(track, state);
      }
    }
  }

  private nextTrackStep(track: MDSongDataTrack, state: MDSongDataTrackState) {
    if (state.finished) {
      return;
    }
    if (!this.hasPlayableData(track)) {
      state.finished = true;
      return;
    }
    while (!state.finished) {
      const part = track.parts[state.partIndex];
      if (!part) {
        this.moveToNextPart(track, state);
        continue;
      }
      if (!part.repeat || part.repeat < 1 || !part.beats.some((beat) => beat.repeat >= 1 && beat.data.length > 0)) {
        this.moveToNextPart(track, state);
        continue;
      }
      const beats = part.beats[state.beatIndex];
      if (!beats || !beats.repeat || beats.repeat < 1 || beats.data.length < 1) {
        this.skipBeatGroup(track, part, state);
        continue;
      }
      const step = beats.data[state.positionIndex];
      state.positionIndex++;
      if (state.positionIndex >= beats.data.length) {
        state.positionIndex = 0;
        state.beatCount++;
        if (state.beatCount >= beats.repeat) {
          this.skipBeatGroup(track, part, state);
        }
      }
      return step;
    }
  }

  private async playStep() {
    const steps = this.song!.data.tracks.map((track, index) => this.nextTrackStep(track, this.trackStates[index]));
    const allTracksFinished = this.trackStates.every((state) => state.finished);
    const shouldRepeat = allTracksFinished && this.song!.repeat && this.song!.data.tracks.some((track) => this.hasPlayableData(track));
    const audioBuffers = this.song!.data.tracks.flatMap((track, index) =>
      (steps[index] ?? []).map((name) => ({
        instrument: track.instrument,
        buffer: this.AUDIO_BUFFERS[track.instrument][name],
      })),
    );
    if (allTracksFinished && audioBuffers.length === 0) {
      if (shouldRepeat) {
        this.resetTrackStates();
      } else {
        this.stop();
      }
      return;
    }
    await this.audioContext.resume();
    if (
      this.song!.data.tracks.some(
        (track, index) => track.instrument === INSTRUMENTS.BASS && (steps[index]?.length ?? 0) > 0,
      )
    ) {
      const now = this.audioContext.currentTime;
      const fadeOutEnd = now + this.bassFadeOutDuration;
      this.bassVoices.forEach((gain, source) => {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, fadeOutEnd);
        source.stop(fadeOutEnd);
      });
      this.bassVoices.clear();
    }
    audioBuffers.forEach(({ instrument, buffer }) => {
      const source: AudioBufferSourceNode = this.audioContext.createBufferSource();
      source.buffer = buffer;
      this.gainNode.gain.value = parseFloat(this.volumeControl.value);
      let sourceGain: GainNode | undefined;
      if (instrument === INSTRUMENTS.BASS) {
        sourceGain = this.audioContext.createGain();
        sourceGain.gain.value = 1;
        sourceGain.connect(this.gainNode);
        source.connect(sourceGain);
        this.bassVoices.set(source, sourceGain);
      } else {
        source.connect(this.gainNode);
      }
      source.start();
      this.activeSources++;
      source.addEventListener("ended", () => {
        source.disconnect();
        sourceGain?.disconnect();
        this.bassVoices.delete(source);
        this.activeSources--;
        if (!this.isPlaying()) {
          if (this.activeSources == 0) {
            this.audioContext.suspend();
          }
        }
      });
    });
    if (allTracksFinished) {
      if (shouldRepeat) {
        this.resetTrackStates();
      } else {
        this.stop();
      }
    }
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
    this.resetTrackStates();
    this.requestId = requestAnimationFrame(this.playing.bind(this));
  }

  stop() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = 0;
      this.trackStates = [];
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
    this.beatInterval = this.calcBeatInterval(this.song);
    this.songDuration.innerText = this.calcSongDuration(this.song);
    this.songSpeed.innerText = this.song.bpm.toString();
    this.songName.innerText = this.song.name ?? SONG_NAMES._;
    this.songGenre.innerText = this.song.gender;
    this.songInstruments.innerText = this.calcSongInstruments(this.song);
    this.songRepeat.checked = this.song.repeat ?? false;
    this.availableSongs.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
    this.songInfo.classList.remove(HTML.CLASS_NAMES.LOADING);
  }
}
