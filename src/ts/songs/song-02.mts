import { INSTRUMENTS, SONG_GENDERS, SONG_KEYS, SONG_NAMES } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

export const song_02: MDSong = {
  name: SONG_NAMES._,
  gender: SONG_GENDERS.BLUES,
  key: SONG_KEYS._,
  timeSignature: {
    topNumber: 4,
    bottomNumber: 4,
  },
  bpm: 90,
  subdivisions: 12,

  repeat: true,

  volume: 0.5,

  data: {
    tracks: [
      {
        instrument: INSTRUMENTS.DRUMS,
        mute: false,
        volume: 1,
        parts: [
          {
            repeat: 1,
            beats: [
              {
                data: [
                  ["Fs1", "B0"], //
                  [],
                  [],
                  [],

                  ["Fs1"],
                  [],
                  [],
                  [],

                  ["Fs1"],
                  [],
                  [],
                  [],

                  ["Fs1", "D1"],
                  [],
                  [],
                  [],

                  ["Fs1"],
                  [],
                  [],
                  [],

                  ["Fs1"],
                  [],
                  [],
                  [],
                ],
                repeat: 1,
              },
            ],
          },
        ],
      },
    ],
  },
};
