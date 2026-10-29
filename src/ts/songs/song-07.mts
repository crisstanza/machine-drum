import { SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const pulse = (hit: string[] = []): string[][] => Array.from({ length: 4 }, (_, index) => (index === 0 ? hit : []));

const bar = (pulses: string[][][]): string[][] => pulses.flat();

const buildFourBarPattern = (groove: string[][], variation: string[][], fill: string[][]): string[][] => [...groove, ...variation, ...groove, ...fill];

const bossaGroove = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
]);
const bossaVariation = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["B0", "Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
]);
const introFill = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1", "A1"]),
]);

const verseFill = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["D1", "Fs1"]),
  pulse(["Fs1", "A1"]),
]);
const verseFillAlt = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1", "D2"]),
]);

const chorusFill = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["B0", "Fs1"]),
  pulse(["D1", "Fs1"]),
  pulse(["Fs1", "A2"]),
]);

const outroBar = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(),
]);

export const song_07: MDSong = {
  name: "Brisa Reta de Copacabana",
  gender: SONG_GENDERS.BOSSA_NOVA,
  time: 4,
  bpm: 120,
  repeat: false,
  prompt: "Crie uma versão de Brisa de Copacabana com a mesma estrutura e pegada de Bossa Nova, usando uma base fácil de acompanhar no violão, com síncopes leves no bumbo e sem subdivisões curtas.",
  data: {
    parts: [
      {
        repeat: 1,
        beats: [
          {
            repeat: 4,
            data: [["Gs2"], [], [], [], [], [], [], []],
          },
        ],
      },
      {
        repeat: 1,
        beats: [
          { data: buildFourBarPattern(bossaGroove, bossaVariation, introFill), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, verseFill), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, verseFillAlt), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, verseFill), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, chorusFill), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, chorusFill), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, verseFillAlt), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, verseFill), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, chorusFill), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, chorusFill), repeat: 1 },
          { data: buildFourBarPattern(bossaGroove, bossaVariation, bossaGroove), repeat: 1 },
          { data: outroBar, repeat: 1 },
        ],
      },
    ],
  },
};
