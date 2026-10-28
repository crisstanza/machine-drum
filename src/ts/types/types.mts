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
  parts: MDSongDataPart[];
};

export type MDSongDataPart = {
  repeat: number;
  beats: MDSongDataPartSongBeats[];
};

export type MDSongDataPartSongBeats = {
  repeat: number;
  data: string[][];
};

export type MDAudioBufferMap = Record<string, AudioBuffer>;
