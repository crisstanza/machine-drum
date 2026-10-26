export type MDSong = MDSongBeats[];

export type MDSongBeats = {
  beats: string[][];
  repeat: number;
};

export type MDAudioBufferMap = Record<string, AudioBuffer>;
