export type MDSong = {
  repeat: boolean;
  data: MDSongBeats[];
};

export type MDSongBeats = {
  beats: string[][];
  repeat: number;
};

export type MDAudioBufferMap = Record<string, AudioBuffer>;
