import { SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

export const song_01: MDSong = {
  gender: SONG_GENDERS.POP_ROCK,
  time: 4,
  bpm: 117,
  repeat: false,
  data: {
    parts: [
      {
        repeat: 1,
        beats: [
          {
            data: [["Gs2"], [""], [""], [""], [""], [""], [""], [""]],
            repeat: 4,
          },
        ],
      },
      {
        repeat: 4,
        beats: [
          {
            data: [
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
            data: [
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
            repeat: 3,
          },
        ],
      },
      {
        repeat: 1,
        beats: [
          {
            data: [["E2", "A2", "Fs1", "B0"]],
            repeat: 1,
          },
        ],
      },
    ],
  },
};
