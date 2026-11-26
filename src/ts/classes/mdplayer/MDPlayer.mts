import { ACCIDENTALS, BASS_AUDIO_FILES, DRUMS_AUDIO_FILES, GUITAR_CLEAN_AUDIO_FILES, PIANO_AUDIO_FILES } from "../../config/config.mjs";
import { HTML, INSTRUMENTS, SONG_KEYS, SONG_NAMES } from "../../enums/enums.mjs";
import { MDInstrument, MDSong, MDSongDataTrack, MDSongDataTrackPart, MDSongDataTrackState, MDSongMap } from "../../types/types.mjs";
import { MDPlayerConstants } from "./MDPlayerConstants.mjs";

export class MDPlayer extends MDPlayerConstants {
  private readonly scheduleAheadTime = 0.1;
  private readonly scheduleLeadTime = 0.05;
  private readonly schedulerInterval = 25;
  private schedulerTimer = 0;
  private nextStepTime = 0;
  private pendingStopTime?: number;
  private readonly scheduledPlayhead: { time: number; stepIndex: number }[] = [];
  private readonly scheduledSources = new Map<AudioBufferSourceNode, number>();
  private isPaused = false;
  private currentStepIndex = 0;
  private currentPlayheadStepIndex = 0;
  private isSeekingProgress = false;

  private activeSources = 0;
  private subdivisionsInterval = 0;

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
    this.currentPlayheadStepIndex = 0;
    if (!this.isSeekingProgress) {
      this.songProgress.value = "0";
      this.updateSongPosition(0);
    }
  }

  private updateSongPosition(stepIndex: number) {
    if (!this.song) {
      return;
    }
    const elapsedSeconds = Math.floor((stepIndex * this.calcSubdivisionsInterval(this.song)) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
    this.songPosition.innerText = `${minutes}:${seconds}`;
  }

  private seekSongPosition(stepIndex: number) {
    this.cancelPendingScheduledSources();
    this.scheduledPlayhead.length = 0;
    this.pendingStopTime = undefined;
    this.resetTrackStates();
    for (let i = 0; i < stepIndex; i++) {
      this.song!.data.tracks.forEach((track, index) => this.nextTrackStep(track, this.trackStates[index]));
    }
    this.currentStepIndex = stepIndex;
    this.currentPlayheadStepIndex = stepIndex;
    this.nextStepTime = this.isPlaying() ? this.audioContext.currentTime + this.scheduleLeadTime : 0;
    this.songProgress.value = stepIndex.toString();
    this.updateSongPosition(stepIndex);
  }

  private calcSubdivisionsInterval(song: MDSong) {
    return 1000 / (song.bpm / 60) / song.subdivisions;
  }

  public masterVolumeChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    target.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.MASTER_VOLUME(target.value));
  }

  private trackVolumeChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    target.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.VOLUME(target.value));
  }

  private showSongTracks(song: MDSong) {
    this.songTracks.innerText = "";
    song.data.tracks.forEach((track: MDSongDataTrack, i) => {
      const span: HTMLSpanElement = document.createElement("span");
      const range: HTMLInputElement = document.createElement("input");
      const volume: string = track.volume.toString();
      range.classList.add(HTML.CLASS_NAMES.VOLUME);
      range.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.VOLUME(volume));
      range.setAttribute(HTML.ATTRIBUTE_NAMES.TYPE, HTML.ATTRIBUTE_VALUES.RANGE);
      range.setAttribute(HTML.ATTRIBUTE_NAMES.MIN, "0");
      range.setAttribute(HTML.ATTRIBUTE_NAMES.MAX, "1.5");
      range.setAttribute(HTML.ATTRIBUTE_NAMES.STEP, "0.05");
      range.setAttribute(HTML.ATTRIBUTE_NAMES.VALUE, volume);
      range.addEventListener("change", this.trackVolumeChanged);
      const link: HTMLAnchorElement = document.createElement("a");
      link.textContent = track.instrument;
      if (track.mute) {
        link.classList.add(HTML.CLASS_NAMES.MUTED);
        link.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.UNMUTE);
      } else {
        link.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.MUTE);
      }
      link.addEventListener("click", () => this.trackNameClicked(link, song, i));
      span.appendChild(range);
      span.appendChild(link);
      this.songTracks.appendChild(span);
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
    const durationInSeconds = Math.floor((steps * this.calcSubdivisionsInterval(song)) / 1000);
    const minutes = Math.floor(durationInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (durationInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  private async loadAudioFiles(instrument: MDInstrument, names: string[]) {
    await Promise.all(
      names.map(async (name) => {
        const audioPath = `audio/${instrument}/${name}.wav`;
        const response = await fetch(new URL(audioPath, window.location.href));
        if (!response.ok) {
          throw new Error(`Could not load audio file: ${audioPath}`);
        }
        const audioBuffer = await this.audioContext.decodeAudioData(await response.arrayBuffer());
        this.AUDIO_BUFFERS[instrument][name] = audioBuffer;
        Object.entries(ACCIDENTALS[instrument]).forEach(([accidental, audioFile]) => {
          if (audioFile === name) {
            this.AUDIO_BUFFERS[instrument][accidental] = audioBuffer;
          }
        });
      }),
    );
  }

  initAudios() {
    this.audioLoading = Promise.all([
      this.loadAudioFiles(INSTRUMENTS.DRUMS, DRUMS_AUDIO_FILES), //
      this.loadAudioFiles(INSTRUMENTS.BASS, BASS_AUDIO_FILES),
      this.loadAudioFiles(INSTRUMENTS.GUITAR_CLEAN, GUITAR_CLEAN_AUDIO_FILES),
      this.loadAudioFiles(INSTRUMENTS.PIANO, PIANO_AUDIO_FILES),
    ]).then(() => {
      this.gainNode.connect(this.audioContext.destination);
    });
    return this.audioLoading;
  }

  private fadeOutVoices(voices: Map<AudioBufferSourceNode, GainNode>, when: number) {
    const fadeOutStart = Math.max(this.audioContext.currentTime, when);
    const fadeOutEnd = fadeOutStart + this.noteFadeOutDuration;
    voices.forEach((gain, source) => {
      gain.gain.cancelScheduledValues(fadeOutStart);
      gain.gain.setValueAtTime(gain.gain.value, fadeOutStart);
      gain.gain.linearRampToValueAtTime(0, fadeOutEnd);
      source.stop(fadeOutEnd);
    });
    voices.clear();
  }

  async initUserInterface() {
    for (let i = this.MIN_SONG; i <= this.MAX_SONG; i++) {
      try {
        const module = (await import(`../../songs/song-${this.calcFriendlySongIndex(i)}.mjs`)) as MDSongMap;
        Object.keys(module).forEach((exportedObject) => this.songs.push(module[exportedObject]));
      } catch (exc) {
        console.info(`End of songs loading. Total: ${this.songs.length}.`, exc);
        break;
      }
    }
    this.availableSongs.options.length = 0;
    this.songs.forEach((song, i) => {
      const newOption = document.createElement("option");
      newOption.value = i.toString();
      newOption.text = `${i + 1}) ${song.name ?? SONG_NAMES._} | ${song.gender}`;
      this.availableSongs.add(newOption);
    });
    this.songChanged();
    this.playButton.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
  }

  private calcFriendlySongIndex(i: number) {
    const id = Math.abs(i).toString().padStart(2, "0");
    if (i < 0) {
      return `-${id}`;
    }
    return id;
  }

  private updateScheduledPlayhead(currentTime: number) {
    while (this.scheduledPlayhead.length > 0 && this.scheduledPlayhead[0].time <= currentTime) {
      const { stepIndex } = this.scheduledPlayhead.shift()!;
      this.currentPlayheadStepIndex = stepIndex;
      if (!this.isSeekingProgress) {
        this.songProgress.value = stepIndex.toString();
        this.updateSongPosition(stepIndex);
      }
    }
  }

  private async schedulePlayback() {
    if (this.isPaused || !this.isPlaying()) {
      return;
    }
    if (this.audioContext.state !== "running") {
      await this.audioContext.resume();
    }
    if (this.isPaused || !this.isPlaying()) {
      return;
    }

    const now = this.audioContext.currentTime;
    if (this.nextStepTime <= now) {
      this.nextStepTime = now + this.scheduleLeadTime;
    }
    this.updateScheduledPlayhead(now);
    if (this.pendingStopTime !== undefined && now >= this.pendingStopTime) {
      this.stop(false);
      return;
    }

    this.syncTrackMutes();
    const stepDuration = this.subdivisionsInterval / 1000;
    while (this.pendingStopTime === undefined && this.nextStepTime < now + this.scheduleAheadTime) {
      this.playStep(this.nextStepTime);
      this.nextStepTime += stepDuration;
    }

    this.updateScheduledPlayhead(this.audioContext.currentTime);
    if (this.pendingStopTime !== undefined && this.audioContext.currentTime >= this.pendingStopTime) {
      this.stop(false);
      return;
    }
    if (this.isPlaying() && !this.isPaused) {
      this.schedulerTimer = window.setTimeout(() => {
        this.schedulerTimer = 0;
        void this.schedulePlayback();
      }, this.schedulerInterval);
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

  private playStep(when: number) {
    if (this.isPaused || !this.isPlaying()) {
      return;
    }
    this.syncTrackMutes();
    const steps = this.song!.data.tracks.map((track, index) => this.nextTrackStep(track, this.trackStates[index]));
    const stepIndex = this.currentStepIndex;
    this.scheduledPlayhead.push({ time: when, stepIndex });
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
        this.resetTrackStates();
        this.currentStepIndex = 0;
      } else {
        this.pendingStopTime = when;
      }
      return;
    }
    if (this.song!.data.tracks.some((track, index) => !track.mute && track.instrument === INSTRUMENTS.BASS && (steps[index]?.length ?? 0) > 0)) {
      this.fadeOutVoices(this.bassVoices, when);
    }
    if (this.song!.data.tracks.some((track, index) => !track.mute && track.instrument === INSTRUMENTS.GUITAR_CLEAN && (steps[index]?.length ?? 0) > 0)) {
      this.fadeOutVoices(this.guitarCleanVoices, when);
    }
    if (this.song!.data.tracks.some((track, index) => !track.mute && track.instrument === INSTRUMENTS.PIANO && (steps[index]?.length ?? 0) > 0)) {
      this.fadeOutVoices(this.pianoVoices, when);
    }
    audioBuffers.forEach(({ trackIndex, instrument, buffer }) => {
      const source: AudioBufferSourceNode = this.audioContext.createBufferSource();
      source.buffer = buffer;
      this.gainNode.gain.value = parseFloat(this.masterVolumeControl.value);
      let sourceGain: GainNode | undefined;
      let voices: Map<AudioBufferSourceNode, GainNode> | undefined;
      if (instrument === INSTRUMENTS.BASS || instrument === INSTRUMENTS.GUITAR_CLEAN || instrument === INSTRUMENTS.PIANO) {
        sourceGain = this.audioContext.createGain();
        sourceGain.gain.value = 1;
        sourceGain.connect(this.trackGainNodes[trackIndex]);
        source.connect(sourceGain);
        voices = instrument === INSTRUMENTS.BASS ? this.bassVoices : instrument === INSTRUMENTS.GUITAR_CLEAN ? this.guitarCleanVoices : this.pianoVoices;
        voices.set(source, sourceGain);
      } else {
        source.connect(this.trackGainNodes[trackIndex]);
      }
      source.start(when);
      this.scheduledSources.set(source, when);
      this.activeSources++;
      source.addEventListener("ended", () => {
        source.disconnect();
        sourceGain?.disconnect();
        this.scheduledSources.delete(source);
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
        this.resetTrackStates();
        this.currentStepIndex = 0;
      } else {
        this.pendingStopTime = when;
      }
    }
  }

  private cancelPendingScheduledSources() {
    const now = this.audioContext.currentTime;
    this.scheduledSources.forEach((startTime, source) => {
      if (startTime > now) {
        source.stop();
        this.scheduledSources.delete(source);
      }
    });
  }

  private isPlaying() {
    return this.isPaused || this.playButton.classList.contains(HTML.CLASS_NAMES.ACTIVE);
  }

  play() {
    if (this.isPlaying()) {
      if (this.isPaused) {
        this.pause();
      }
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
    this.nextStepTime = 0;
    this.pendingStopTime = undefined;
    void this.schedulePlayback();
  }

  async pause() {
    if (!this.isPlaying()) {
      return;
    }
    if (this.isPaused) {
      await this.audioContext.resume();
      this.isPaused = false;
      this.playButton.classList.add(HTML.CLASS_NAMES.ACTIVE);
      this.pauseButton.classList.remove(HTML.CLASS_NAMES.ACTIVE);
      this.pauseButton.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.PAUSE);
      void this.schedulePlayback();
      return;
    }
    this.isPaused = true;
    this.playButton.classList.remove(HTML.CLASS_NAMES.ACTIVE);
    this.pauseButton.classList.add(HTML.CLASS_NAMES.ACTIVE);
    this.pauseButton.classList.add(HTML.CLASS_NAMES.CLICKABLE);
    this.pauseButton.setAttribute(HTML.ATTRIBUTE_NAMES.TITLE, HTML.ATTRIBUTE_VALUES.UNPAUSE);
    if (this.schedulerTimer) {
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = 0;
    }
    await this.audioContext.suspend();
  }

  stop(resetProgress = true) {
    if (this.isPlaying()) {
      const wasPaused = this.isPaused;
      this.isSeekingProgress = false;
      if (this.schedulerTimer) {
        window.clearTimeout(this.schedulerTimer);
      }
      this.schedulerTimer = 0;
      this.cancelPendingScheduledSources();
      this.scheduledPlayhead.length = 0;
      this.nextStepTime = 0;
      this.pendingStopTime = undefined;
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
    const stepDuration = this.calcSubdivisionsInterval(song) / 1000;
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
      for (const instrument of [INSTRUMENTS.BASS, INSTRUMENTS.GUITAR_CLEAN, INSTRUMENTS.PIANO]) {
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
        if (instrument === INSTRUMENTS.BASS || instrument === INSTRUMENTS.GUITAR_CLEAN || instrument === INSTRUMENTS.PIANO) {
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
    this.subdivisionsInterval = this.calcSubdivisionsInterval(this.song);
    this.songDuration.innerText = this.calcSongDuration(this.song);
    this.updateSongPosition(this.currentPlayheadStepIndex);
  }

  plus10Bpm() {
    if (this.song) {
      this.updateSongSpeed(this.songSpeed.valueAsNumber + 10);
    }
  }

  songSpeedChanged() {
    if (this.song) {
      this.updateSongSpeed(this.songSpeed.valueAsNumber);
    }
  }

  minus10Bpm() {
    if (this.song) {
      this.updateSongSpeed(this.songSpeed.valueAsNumber - 10);
    }
  }

  songChanged() {
    this.song = this.songs[this.availableSongs.selectedIndex];
    this.isSeekingProgress = false;
    this.songProgress.max = Math.max(0, this.calcSongSteps(this.song) - 1).toString();
    this.resetSongPosition();
    this.subdivisionsInterval = this.calcSubdivisionsInterval(this.song);
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
    this.showSongTracks(this.song);
    this.songRepeat.checked = this.song.repeat ?? false;
    this.availableSongs.removeAttribute(HTML.ATTRIBUTE_NAMES.DISABLED);
    this.songInfo.classList.remove(HTML.CLASS_NAMES.LOADING);
    this.songInfoDynamic.classList.remove(HTML.CLASS_NAMES.LOADING);
    this.songDownload.classList.remove(HTML.CLASS_NAMES.LOADING);
  }
}
