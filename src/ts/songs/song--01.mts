import { INSTRUMENTS, SONG_GENDERS, SONG_KEYS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

export const song_00: MDSong = {
  name: "Subdivisions Test (16)",
  gender: SONG_GENDERS._,
  key: SONG_KEYS._,

  timeSignature: {
    topNumber: 4,
    bottomNumber: 4,
  },
  bpm: 60,
  subdivisions: 16,

  repeat: true,

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
                repeat: 1,
                data: [
                  ["Fs1", "B0"],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [], //
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                  [],
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
