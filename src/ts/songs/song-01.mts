import { SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

export const song_01: MDSong = {
  gender: SONG_GENDERS.POP_ROCK,
  time: 4,
  bpm: 117,
  repeat: true,
  data: [
    {
      beats: [
        ["A2", "Fs1", "B0"], //
        [""],
        [""],
        [""],

        ["Fs1"],
        [""],
        [""],
        [""],

        ["Fs1", "D1"],
        [""],
        [""],
        [""],

        ["Fs1"],
        [""],
        [""],
        [""],
      ],
      repeat: 1,
    },
    {
      beats: [
        ["Fs1", "B0"], //
        [""],
        [""],
        [""],

        ["Fs1"],
        [""],
        [""],
        [""],

        ["Fs1", "D1"],
        [""],
        [""],
        [""],

        ["Fs1"],
        [""],
        [""],
        [""],
      ],
      repeat: 7,
    },
  ],
};
