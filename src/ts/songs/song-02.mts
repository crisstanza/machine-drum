import { SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

export const song_02: MDSong = {
  gender: SONG_GENDERS.BLUES,
  time: 4,
  bpm: 90,
  repeat: true,
  data: {
    parts: [
      {
        repeat: 1,
        beats: [
          {
            data: [
              ["Fs1", "B0"], //
              [""],
              [""],
              [""],

              ["Fs1"],
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

              ["Fs1"],
              [""],
              [""],
              [""],
            ],
            repeat: 1,
          },
        ],
      },
    ],
  },
};
