import { SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const pulse = (hit: string[] = [], notes: string[][] = []): string[][] => Array.from({ length: 4 }, (_, index) => (index === 0 ? hit : (notes[index - 1] ?? [])));

const bar = (pulses: string[][][]): string[][] => pulses.flat();

const buildFourBarPattern = (groove: string[][], fill: string[][]): string[][] => [...groove, ...groove, ...groove, ...fill];

const introGroove = bar([
  pulse(["B0", "D#2"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2"]),
  pulse(["B0", "Fs1"]),
  pulse(["C#1", "Fs1", "D#2"]),
  pulse(["Fs1"]),
]);
const introFill = bar([
  pulse(["B0", "D#2"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2"]),
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"], [["D1"]]),
  pulse(["Fs1"], [["D1"], [], ["C#1"]]),
]);

const verseGroove = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["B0", "Fs1"]),
  pulse(["C#1", "D#2", "Fs1"]),
  pulse(["Fs1"]),
]);
const verseFill = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"], [["D1"], [], ["D1"]]),
  pulse(["Fs1"], [["D1"], [], ["C#1"]]),
]);
const verseFillAlt = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["B0", "Fs1"]),
  pulse(["C#1", "D#2", "Fs1"]),
  pulse(["Fs1"], [["D1"], [], ["C#1"]]),
]);

const chorusGroove = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["B0", "Fs1"]),
  pulse(["C#1", "D#2", "Fs1"]),
  pulse(["A#1"]),
]);
const chorusFill = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["B0", "Fs1"]),
  pulse(["C#1", "D#2", "Fs1"], [["D1"]]),
  pulse(["A#1"], [["D1"], [], ["C#1"]]),
]);

const outroGroove = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "D#2", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["C#1", "D#2", "Fs1"]),
  pulse(["Fs1"]),
]);
const outroBar = bar([
  pulse(["B0", "D#2", "Fs1"]), //
  pulse(["Fs1"]),
  pulse(["C#1", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["B0", "Fs1"]),
  pulse(["Fs1"]),
  pulse(["C#1", "D#2", "Fs1"]),
  pulse(["B0"]),
]);

export const song_06: MDSong = {
  name: "Brisa de Copacabana",
  gender: SONG_GENDERS.BOSSA_NOVA,
  time: 4,
  bpm: 120,
  repeat: false,
  prompt: "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-XX.mts` que seja um ritmo de BOSSA NOVA.\n\nFaça uma música completa de aproximadamente 1 minuto e meio, com introdução, verso e refrão, na ordem que você achar melhor.\n\nPara saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\nNo novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\nNesta sessão, não edite a classe `MDPlayer`.",
  data: {
    tracks: [
      {
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
              { data: buildFourBarPattern(introGroove, introFill), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFill), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFillAlt), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFill), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFillAlt), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFill), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 1 },
              { data: buildFourBarPattern(outroGroove, outroGroove), repeat: 1 },
              { data: outroBar, repeat: 1 },
            ],
          },
        ],
      },
    ],
  },
};
