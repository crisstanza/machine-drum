import { MDSong } from "../types/types.mjs";

const intro: string[][] = [
  ["B0"], //
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  ["Fs1"],
  [""],
  ["B0"],
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  ["Fs1"],
  [""],
];

const skaGroove: string[][] = [
  ["B0"], //
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  ["B0", "Fs1"],
  [""],
  ["B0"],
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  ["Fs1"],
  [""],
];

const reggaeGroove: string[][] = [
  [""], //
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  ["Fs1"],
  ["B0"],
  ["B0", "D1"],
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  ["Fs1"],
  [""],
];

const turnaround: string[][] = [
  ["B0"], //
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  ["Fs1"],
  [""],
  ["B0"],
  [""],
  ["A1"],
  ["B1"],
  ["D1"],
  ["A1"],
  ["B1"],
  ["D2"],
];

const ending: string[][] = [
  ["B0", "Fs1"], //
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  ["Fs1"],
  [""],
  ["B0"],
  [""],
  ["Fs1"],
  [""],
  ["D1"],
  [""],
  [""],
  ["B0", "D1"],
];

export const song7: MDSong = {
  time: 4,
  bpm: 140,
  repeat: false,
  data: [
    { beats: intro, repeat: 1 },
    { beats: skaGroove, repeat: 3 },
    { beats: reggaeGroove, repeat: 1 },
    { beats: turnaround, repeat: 1 },
    { beats: skaGroove, repeat: 3 },
    { beats: ending, repeat: 1 },
  ],
};
