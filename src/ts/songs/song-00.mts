import { INSTRUMENTS, SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

export const song_00: MDSong = {
  name: "Test Song",
  gender: SONG_GENDERS._,

  time: 4,
  bpm: 60,

  repeat: false,

  data: {
    tracks: [
      {
        instrument: INSTRUMENTS.DRUMS,
        mute: true,
        parts: [
          {
            repeat: 1,
            beats: [
              {
                repeat: 3,
                data: [["Fs1"], [], [], [], [], [], [], []],
              },
              {
                repeat: 1,
                data: [["Gs2"], [], [], [], [], [], [], []],
              },
            ],
          },
        ],
      },
      {
        instrument: INSTRUMENTS.BASS,
        mute: false,
        parts: [
          {
            repeat: 1,
            beats: [
              {
                repeat: 2,
                data: [["E2"], [], [], [], [], [], [], []],
              },
            ],
          },
        ],
      },
    ],
  },
};
