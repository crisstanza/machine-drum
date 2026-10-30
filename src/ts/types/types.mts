import { SONG_GENDERS } from "../enums/enums.mjs";

export type MDSongGender = (typeof SONG_GENDERS)[keyof typeof SONG_GENDERS];

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
export type MDSongMap = Record<string, MDSong>;
