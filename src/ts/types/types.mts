import { INSTRUMENTS, SONG_GENDERS } from "../enums/enums.mjs";

export type MDSongGender = (typeof SONG_GENDERS)[keyof typeof SONG_GENDERS];

export type MDInstrument = (typeof INSTRUMENTS)[keyof typeof INSTRUMENTS];

export type MDSong = {
  name?: string;
  gender: MDSongGender;
  prompt?: string;

  time: number;
  bpm: number;

  repeat: boolean;

  data: MDSongData;
};

export type MDSongData = {
  tracks: MDSongDataTrack[];
};

export type MDSongDataTrack = {
  name?: string;
  instrument: MDInstrument;
  mute: boolean;
  parts: MDSongDataTrackPart[];
};

export type MDSongDataTrackPart = {
  repeat: number;
  beats: MDSongDataTrackPartSongBeats[];
};

export type MDSongDataTrackPartSongBeats = {
  repeat: number;
  data: string[][];
};

export type MDAudioBufferMap = Record<string, AudioBuffer>;
export type MDAudioBufferMapMap = Record<MDInstrument, MDAudioBufferMap>;
export type MDSongMap = Record<string, MDSong>;

export type MDSongDataTrackState = {
  partIndex: number;
  beatIndex: number;
  positionIndex: number;
  partCount: number;
  beatCount: number;
  finished: boolean;
};
