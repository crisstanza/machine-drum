import { INSTRUMENTS, SONG_GENDERS, SONG_KEYS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

export const song_00: MDSong = {
  name: "Escala de Mi bemol maior",
  gender: SONG_GENDERS._,
  key: SONG_KEYS.Eb,

  timeSignature: {
    topNumber: 4,
    bottomNumber: 4,
  },
  bpm: 120,
  subdivisions: 1,

  repeat: true,

  data: {
    tracks: [
      {
        instrument: INSTRUMENTS.GUITAR_CLEAN,
        mute: false,
        parts: [
          {
            repeat: 1,
            beats: [
              {
                repeat: 1,
                data: [["Eb1"], ["F1"], ["G1"], ["Ab1"], ["Bb1"], ["C2"], ["D2"], ["Eb2"]],
              },
            ],
          },
        ],
      },
    ],
  },
};
