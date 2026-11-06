import { BASS_AUDIO_FILES, DRUMS_AUDIO_FILES, GUITAR_CLEAN_AUDIO_FILES } from "../../config/config.mjs";
import { HTML, INSTRUMENTS, SONG_KEYS, SONG_NAMES } from "../../enums/enums.mjs";
import { MDInstrument, MDSong, MDSongDataTrack, MDSongDataTrackPart, MDSongDataTrackState, MDSongMap } from "../../types/types.mjs";
import { MDPlayerConstants } from "./MDPlayerConstants.mjs";

export class MDPlayer extends MDPlayerConstants {
  private requestId = 0;
  private timeControl = 0;
  private isPaused = false;
  private pausedAt = 0;
  private currentStepIndex = 0;
  private isSeekingProgress = false;

  private activeSources = 0;
  private beatInterval = 0;

  private song?: MDSong;
  private audioLoading?: Promise<void>;
  private downloadUrl?: string;
  private isDownloading = false;

  private syncTrackMutes() {
    this.song!.data.tracks.forEach((track, index) => {
      let gainNode = this.trackGainNodes[index];
      if (!gainNode) {
        gainNode = this.audioContext.createGain();
        gainNode.connect(this.gainNode);
        this.trackGainNodes[index] = gainNode;
      }
      gainNode.gain.value = track.mute ? 0 : 1;
    });
  }

  private hasPlayableData(track: MDSongDataTrack) {
    return track.parts.some((part) => part.repeat >= 1 && part.beats.some((beat) => beat.repeat >= 1 && beat.data.length > 0));
  }

  private resetTrackStates() {
    this.trackStates.length = 0;
    this.trackStates.push(
      ...this.song!.data.tracks.map(() => ({
        partIndex: 0,
        beatIndex: 0,
        positionIndex: 0,
        partCount: 0,
        beatCount: 0,
        finished: false,
      })),
    );
  }

  private resetSongPosition() {
    this.resetTrackStates();
    this.currentStepIndex = 0;
    if (!this.isSeekingProgress) {
      this.songProgress.value = "0";
      this.updateSongPosition(0);
    }
  }

  private updateSongPosition(stepIndex: number) {
    if (!this.song) {
      return;
    }
    const elapsedSeconds = Math.floor((stepIndex * this.calcBeatInterval(this.song)) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
    this.songPosition.innerText = `${minutes}:${seconds}`;
  }

  private seekSongPosition(stepIndex: number) {
    this.resetTrackStates();
    for (let i = 0; i < stepIndex; i++) {
      this.song!.data.tracks.forEach((track, index) => this.nextTrackStep(track, this.trackStates[index]));
    }
    this.currentStepIndex = stepIndex;
    this.songProgress.value = stepIndex.toString();
    this.updateSongPosition(stepIndex);
  }

  private calcBeatInterval(song: MDSong) {
    return (1000 * 60) / (song.timeSignature.bottomNumber * 2 * song.bpm);
  }

  private async calcDownloadStepDuration(song: MDSong) {
    const frameTimestamps = await new Promise<number[]>((resolve) => {
      const timestamps: number[] = [];
      const sampleFrame = (timestamp: number) => {
        timestamps.push(timestamp);
        if (timestamps.length === 25) {
          resolve(timestamps);
          return;
        }
        requestAnimationFrame(sampleFrame);
      };
      requestAnimationFrame(sampleFrame);
    });
    const frameInterval = (frameTimestamps[frameTimestamps.length - 1] - frameTimestamps[0]) / (frameTimestamps.length - 1);
    const stepDuration = this.calcBeatInterval(song);
    return Math.ceil(stepDuration / frameInterval) * frameInterval;
  }

  private calcSongTracks(song: MDSong) {
    this.songTracks.innerText = "";
    const trackNames = song.data.tracks.map((track) => track.instrument);
    trackNames.forEach((trackName, i) => {
      const link: HTMLAnchorElement = document.createElement("a");
      link.textContent = trackName;
      const track: MDSongDataTrack = song.data.tracks[i];
      if (track.mute) {
        link.classList.add(HTML.CLASS_NAMES.MUTED);
        link.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.UNMUTE);
      } else {
        link.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.MUTE);
      }
      link.addEventListener("click", () => this.trackNameClicked(link, song, i));
      this.songTracks.appendChild(link);
      if (i < trackNames.length - 1) {
        this.songTracks.appendChild(document.createTextNode(", "));
      }
    });
  }

  private trackNameClicked(link: HTMLAnchorElement, song: MDSong, i: number) {
    const track: MDSongDataTrack = song.data.tracks[i];
    if (link.classList.contains(HTML.CLASS_NAMES.MUTED)) {
      link.classList.remove(HTML.CLASS_NAMES.MUTED);
      link.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.MUTE);
      track.mute = false;
    } else {
      link.classList.add(HTML.CLASS_NAMES.MUTED);
      link.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.UNMUTE);
      track.mute = true;
    }
  }

  private calcSongSteps(song: MDSong) {
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
    return Math.max(0, ...trackSteps);
  }

  private calcSongDuration(song: MDSong) {
    const steps = this.calcSongSteps(song);
    const durationInSeconds = Math.floor((steps * this.calcBeatInterval(song)) / 1000);
    const minutes = Math.floor(durationInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (durationInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  private async loadAudioFiles(instrument: MDInstrument, names: string[]) {
    await Promise.all(
      names.map(async (name) => {
        const response = await fetch(new URL(`audio/${instrument}/${name}.wav`, window.location.href));
        if (!response.ok) {
          throw new Error(`Could not load audio file: ${instrument}/${name}.wav`);
        }
        this.AUDIO_BUFFERS[instrument][name] = await this.audioContext.decodeAudioData(await response.arrayBuffer());
      }),
    );
  }

  initAudios() {
    this.audioLoading = Promise.all([this.loadAudioFiles(INSTRUMENTS.DRUMS, DRUMS_AUDIO_FILES), this.loadAudioFiles(INSTRUMENTS.BASS, BASS_AUDIO_FILES), this.loadAudioFiles(INSTRUMENTS.GUITAR_CLEAN, GUITAR_CLEAN_AUDIO_FILES)]).then(() => {
      this.gainNode.connect(this.audioContext.destination);
    });
    return this.audioLoading;
  }

  private fadeOutVoices(voices: Map<AudioBufferSourceNode, GainNode>) {
    const now = this.audioContext.currentTime;
    const fadeOutEnd = now + this.noteFadeOutDuration;
    voices.forEach((gain, source) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, fadeOutEnd);
      source.stop(fadeOutEnd);
    });
    voices.clear();
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
      newOption.text = `${i}) ${song.name ?? SONG_NAMES._} | ${song.gender}`;
      this.availableSongs.add(newOption);
    });
    this.songChanged();
    this.playButton.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
  }

  private async playing(timestamp: number) {
    if (this.isPaused) {
      return;
    }
    this.syncTrackMutes();
    if (timestamp - this.timeControl >= this.beatInterval) {
      this.timeControl = timestamp;
      await this.playStep();
    }
    if (this.isPlaying() && !this.isPaused) {
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
    if (this.isPaused || !this.isPlaying()) {
      return;
    }
    await this.audioContext.resume();
    if (this.isPaused || !this.isPlaying()) {
      return;
    }
    this.syncTrackMutes();
    const steps = this.song!.data.tracks.map((track, index) => this.nextTrackStep(track, this.trackStates[index]));
    const stepIndex = this.currentStepIndex;
    if (!this.isSeekingProgress) {
      this.songProgress.value = stepIndex.toString();
      this.updateSongPosition(stepIndex);
    }
    this.currentStepIndex++;
    const allTracksFinished = this.trackStates.every((state) => state.finished);
    const shouldRepeat = allTracksFinished && this.song!.repeat && this.song!.data.tracks.some((track) => this.hasPlayableData(track));
    const audioBuffers = this.song!.data.tracks.flatMap((track, index) =>
      (track.mute ? [] : (steps[index] ?? [])).map((name) => ({
        trackIndex: index,
        instrument: track.instrument,
        buffer: this.AUDIO_BUFFERS[track.instrument][name],
      })),
    );
    if (allTracksFinished && audioBuffers.length === 0) {
      if (shouldRepeat) {
        this.resetSongPosition();
      } else {
        this.stop(false);
      }
      return;
    }
    if (this.song!.data.tracks.some((track, index) => !track.mute && track.instrument === INSTRUMENTS.BASS && (steps[index]?.length ?? 0) > 0)) {
      this.fadeOutVoices(this.bassVoices);
    }
    if (this.song!.data.tracks.some((track, index) => !track.mute && track.instrument === INSTRUMENTS.GUITAR_CLEAN && (steps[index]?.length ?? 0) > 0)) {
      this.fadeOutVoices(this.guitarCleanVoices);
    }
    audioBuffers.forEach(({ trackIndex, instrument, buffer }) => {
      const source: AudioBufferSourceNode = this.audioContext.createBufferSource();
      source.buffer = buffer;
      this.gainNode.gain.value = parseFloat(this.volumeControl.value);
      let sourceGain: GainNode | undefined;
      let voices: Map<AudioBufferSourceNode, GainNode> | undefined;
      if (instrument === INSTRUMENTS.BASS || instrument === INSTRUMENTS.GUITAR_CLEAN) {
        sourceGain = this.audioContext.createGain();
        sourceGain.gain.value = 1;
        sourceGain.connect(this.trackGainNodes[trackIndex]);
        source.connect(sourceGain);
        voices = instrument === INSTRUMENTS.BASS ? this.bassVoices : this.guitarCleanVoices;
        voices.set(source, sourceGain);
      } else {
        source.connect(this.trackGainNodes[trackIndex]);
      }
      source.start();
      this.activeSources++;
      source.addEventListener("ended", () => {
        source.disconnect();
        sourceGain?.disconnect();
        voices?.delete(source);
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
        this.resetSongPosition();
      } else {
        this.stop(false);
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
    this.isPaused = false;
    this.pauseButton.classList.remove(HTML.CLASS_NAMES.ACTIVE);
    this.playButton.classList.add(HTML.CLASS_NAMES.ACTIVE);
    this.pauseButton.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
    this.stopButton.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
    this.availableSongs.setAttribute(HTML.ATTRIBUTE_NAMES.DISABLED, "");
    if (this.currentStepIndex >= this.calcSongSteps(this.song!)) {
      this.resetSongPosition();
    }
    this.requestId = requestAnimationFrame(this.playing.bind(this));
  }

  async pause() {
    if (!this.isPlaying()) {
      return;
    }
    if (this.isPaused) {
      await this.audioContext.resume();
      this.timeControl += performance.now() - this.pausedAt;
      this.isPaused = false;
      this.pauseButton.classList.remove(HTML.CLASS_NAMES.ACTIVE);
      this.pauseButton.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.PAUSE);
      this.requestId = requestAnimationFrame(this.playing.bind(this));
      return;
    }
    this.isPaused = true;
    this.pausedAt = performance.now();
    this.pauseButton.classList.add(HTML.CLASS_NAMES.ACTIVE);
    this.pauseButton.classList.add(HTML.CLASS_NAMES.CLICKABLE);
    this.pauseButton.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.UNPAUSE);
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = 0;
    }
    await this.audioContext.suspend();
  }

  stop(resetProgress = true) {
    if (this.isPlaying()) {
      const wasPaused = this.isPaused;
      this.isSeekingProgress = false;
      if (this.requestId) {
        cancelAnimationFrame(this.requestId);
      }
      this.requestId = 0;
      this.isPaused = false;
      this.trackStates.length = 0;
      this.playButton.classList.remove(HTML.CLASS_NAMES.ACTIVE);
      this.pauseButton.classList.remove(HTML.CLASS_NAMES.ACTIVE);
      this.pauseButton.classList.remove(HTML.CLASS_NAMES.CLICKABLE);
      this.pauseButton.setAttribute(HTML.ATTRIBUTE_NAMES.DISABLED, "");
      this.stopButton.setAttribute(HTML.ATTRIBUTE_NAMES.DISABLED, "");
      this.pauseButton.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.PAUSE);
      this.availableSongs.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
      if (resetProgress) {
        this.resetSongPosition();
      } else {
        this.trackStates.length = 0;
      }
      if (wasPaused) {
        this.audioContext.resume();
      }
    }
  }

  private async renderSong(song: MDSong) {
    if (!this.audioLoading) {
      throw new Error("Audio samples have not been initialized.");
    }
    await this.audioLoading;

    const tracks = song.data.tracks;
    const states: MDSongDataTrackState[] = tracks.map(() => ({
      partIndex: 0,
      beatIndex: 0,
      positionIndex: 0,
      partCount: 0,
      beatCount: 0,
      finished: false,
    }));
    const sampleRate = this.audioContext.sampleRate;
    const stepDuration = (await this.calcDownloadStepDuration(song)) / 1000;
    const events: { buffer: AudioBuffer; frame: number; instrument: MDInstrument }[] = [];
    let stepIndex = 0;
    let latestSampleEndFrame = 0;

    while (!states.every((state) => state.finished)) {
      const steps = tracks.map((track, index) => this.nextTrackStep(track, states[index]));
      tracks.forEach((track, trackIndex) => {
        if (track.mute) {
          return;
        }
        (steps[trackIndex] ?? []).forEach((name) => {
          const buffer = this.AUDIO_BUFFERS[track.instrument][name];
          if (!buffer) {
            throw new Error(`Audio sample not found: ${track.instrument}/${name}.wav`);
          }
          const frame = Math.round(stepIndex * stepDuration * sampleRate);
          events.push({ buffer, frame, instrument: track.instrument });
          latestSampleEndFrame = Math.max(latestSampleEndFrame, frame + Math.ceil(buffer.duration * sampleRate));
        });
      });
      stepIndex++;
    }

    const songLength = Math.ceil(stepIndex * stepDuration * sampleRate);
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: 2,
      length: Math.max(1, songLength, latestSampleEndFrame),
      sampleRate,
    });
    const voices = new Map<MDInstrument, { source: AudioBufferSourceNode; gain: GainNode; endFrame: number }[]>();
    for (let eventIndex = 0; eventIndex < events.length; ) {
      const frame = events[eventIndex].frame;
      let nextEventIndex = eventIndex + 1;
      while (nextEventIndex < events.length && events[nextEventIndex].frame === frame) {
        nextEventIndex++;
      }

      const stepEvents = events.slice(eventIndex, nextEventIndex);
      for (const instrument of [INSTRUMENTS.BASS, INSTRUMENTS.GUITAR_CLEAN]) {
        if (!stepEvents.some((event) => event.instrument === instrument)) {
          continue;
        }
        const instrumentVoices = voices.get(instrument) ?? [];
        const now = frame / sampleRate;
        const fadeOutEnd = now + this.noteFadeOutDuration;
        instrumentVoices.forEach(({ source, gain, endFrame }) => {
          const stopFrame = Math.min(endFrame, frame + Math.ceil(this.noteFadeOutDuration * sampleRate));
          if (stopFrame <= frame) {
            return;
          }
          const stopTime = stopFrame / sampleRate;
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.linearRampToValueAtTime(0, Math.min(fadeOutEnd, stopTime));
          source.stop(stopTime);
        });
        voices.set(instrument, []);
      }

      stepEvents.forEach(({ buffer, frame, instrument }) => {
        const source = offlineContext.createBufferSource();
        source.buffer = buffer;
        if (instrument === INSTRUMENTS.BASS || instrument === INSTRUMENTS.GUITAR_CLEAN) {
          const gain = offlineContext.createGain();
          source.connect(gain);
          gain.connect(offlineContext.destination);
          const endFrame = frame + Math.ceil(buffer.duration * sampleRate);
          const instrumentVoices = voices.get(instrument) ?? [];
          instrumentVoices.push({ source, gain, endFrame });
          voices.set(instrument, instrumentVoices);
        } else {
          source.connect(offlineContext.destination);
        }
        source.start(frame / sampleRate);
      });
      eventIndex = nextEventIndex;
    }

    return offlineContext.startRendering();
  }

  private encodeWav(audioBuffer: AudioBuffer) {
    const channelCount = audioBuffer.numberOfChannels;
    const bytesPerSample = 4;
    const dataLength = audioBuffer.length * channelCount * bytesPerSample;
    const wavBuffer = new ArrayBuffer(58 + dataLength);
    const view = new DataView(wavBuffer);
    const writeString = (offset: number, value: string) => {
      for (let i = 0; i < value.length; i++) {
        view.setUint8(offset + i, value.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 50 + dataLength, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 18, true);
    view.setUint16(20, 3, true);
    view.setUint16(22, channelCount, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * channelCount * bytesPerSample, true);
    view.setUint16(32, channelCount * bytesPerSample, true);
    view.setUint16(34, bytesPerSample * 8, true);
    view.setUint16(36, 0, true);
    writeString(38, "fact");
    view.setUint32(42, 4, true);
    view.setUint32(46, audioBuffer.length, true);
    writeString(50, "data");
    view.setUint32(54, dataLength, true);

    const channels = Array.from({ length: channelCount }, (_, index) => audioBuffer.getChannelData(index));
    let offset = 58;
    for (let frame = 0; frame < audioBuffer.length; frame++) {
      for (let channel = 0; channel < channelCount; channel++) {
        view.setFloat32(offset, channels[channel][frame], true);
        offset += bytesPerSample;
      }
    }

    return new Blob([wavBuffer], { type: "audio/wav" });
  }

  private songFileName(song: MDSong, songIndex: number) {
    const name = song.name?.trim() || `song-${songIndex}`;
    return `${name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")} (${song.gender}, ${song.bpm}bpm).wav`;
  }

  async download() {
    if (this.isDownloading) {
      return;
    }
    if (!this.song) {
      throw new Error("No song is selected.");
    }

    this.isDownloading = true;
    this.songDownload.classList.add(HTML.CLASS_NAMES.LOADING);
    try {
      const song = this.song;
      const songIndex = this.availableSongs.selectedIndex;
      const audioBuffer = await this.renderSong(song);
      const url = URL.createObjectURL(this.encodeWav(audioBuffer));
      const fileName = this.songFileName(song, songIndex);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      if (this.downloadUrl) {
        URL.revokeObjectURL(this.downloadUrl);
      }
      this.downloadUrl = url;
    } finally {
      this.isDownloading = false;
      this.songDownload.classList.remove(HTML.CLASS_NAMES.LOADING);
    }
  }

  songRepeatChanged() {
    if (this.song) {
      this.song.repeat = this.songRepeat.checked;
    }
  }

  private updateSongProgress() {
    if (!this.song) {
      return;
    }
    const stepCount = this.calcSongSteps(this.song);
    const stepIndex = Number.isFinite(this.songProgress.valueAsNumber) ? Math.floor(this.songProgress.valueAsNumber) : 0;
    this.seekSongPosition(Math.min(Math.max(0, stepIndex), Math.max(0, stepCount - 1)));
  }

  songProgressChanged() {
    if (this.song) {
      this.updateSongProgress();
      this.isSeekingProgress = false;
    }
  }

  songProgressInput() {
    if (this.song) {
      this.isSeekingProgress = true;
      this.updateSongProgress();
    }
  }

  private updateSongSpeed(bpm: number) {
    if (!this.song) {
      return;
    }
    const max = Number(this.songSpeed.max);
    const min = Number(this.songSpeed.min);
    const newBpm = Math.max(Math.min(Number.isFinite(bpm) ? bpm : this.song.bpm, max), min);
    this.song.bpm = newBpm;
    this.songSpeed.value = newBpm.toString();
    this.beatInterval = this.calcBeatInterval(this.song);
    this.songDuration.innerText = this.calcSongDuration(this.song);
    this.updateSongPosition(this.currentStepIndex);
  }

  plus10Bpm() {
    if (this.song) {
      this.updateSongSpeed(Number(this.songSpeed.value) + 10);
    }
  }

  songSpeedChanged() {
    if (this.song) {
      this.updateSongSpeed(this.songSpeed.valueAsNumber);
    }
  }

  minus10Bpm() {
    if (this.song) {
      this.updateSongSpeed(Number(this.songSpeed.value) - 10);
    }
  }

  songChanged() {
    this.song = this.songs[this.availableSongs.selectedIndex];
    this.isSeekingProgress = false;
    this.songProgress.max = Math.max(0, this.calcSongSteps(this.song) - 1).toString();
    this.resetSongPosition();
    this.beatInterval = this.calcBeatInterval(this.song);
    this.songDuration.innerText = this.calcSongDuration(this.song);
    this.songSpeed.value = this.song.bpm.toString();
    this.songName.innerText = this.song.name ?? SONG_NAMES._;
    if ((this.song.name ?? SONG_NAMES._) == SONG_NAMES._) {
      this.songName.classList.add(HTML.CLASS_NAMES.ITALIC);
    } else {
      this.songName.classList.remove(HTML.CLASS_NAMES.ITALIC);
    }
    this.songGenre.innerText = this.song.gender;
    this.songKey.innerText = this.song.key;
    if (this.song.key == SONG_KEYS._) {
      this.songKey.classList.add(HTML.CLASS_NAMES.ITALIC);
    } else {
      this.songKey.classList.remove(HTML.CLASS_NAMES.ITALIC);
    }
    this.calcSongTracks(this.song);
    this.songRepeat.checked = this.song.repeat ?? false;
    this.availableSongs.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
    this.songInfo.classList.remove(HTML.CLASS_NAMES.LOADING);
    this.songInfoDynamic.classList.remove(HTML.CLASS_NAMES.LOADING);
    this.songDownload.classList.remove(HTML.CLASS_NAMES.LOADING);
  }
}
