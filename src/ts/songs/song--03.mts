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
        instrument: INSTRUMENTS.BASS,
        mute: true,
        volume: 1.25,
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
      {
        instrument: INSTRUMENTS.GUITAR_CLEAN,
        mute: true,
        volume: 0.75,
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
      {
        instrument: INSTRUMENTS.PIANO,
        mute: false,
        volume: 1,
        parts: [
          {
            repeat: 1,
            beats: [
              {
                repeat: 1,
                data: [["Eb0"], ["F0"], ["G0"], ["Ab0"], ["Bb0"], ["C1"], ["D1"], ["Eb1"]],
              },
            ],
          },
        ],
      },
    ],
  },
};
