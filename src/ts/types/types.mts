export type MDSong = {
  time: number;
  bpm: number;
  repeat: boolean;
  data: MDSongBeats[];
  prompt?: string;
};

export type MDSongBeats = {
  beats: string[][];
  repeat: number;
};

export type MDAudioBufferMap = Record<string, AudioBuffer>;
