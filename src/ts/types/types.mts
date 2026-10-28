import { SONG_GENDERS } from "../enums/enums.mjs";

export type MDSongGender = (typeof SONG_GENDERS)[keyof typeof SONG_GENDERS];

export type MDSong = {
  time: number;
  bpm: number;
  repeat: boolean;
  data: MDSongBeats[];
  prompt?: string;
  gender: MDSongGender;
};

export type MDSongBeats = {
  beats: string[][];
  repeat: number;
};

export type MDAudioBufferMap = Record<string, AudioBuffer>;
