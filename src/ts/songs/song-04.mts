import { SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const introGroove = [
  ["Cs2", "B0"], //
  [],
  ["Fs1"],
  [],
  ["Fs1", "D1"],
  [],
  ["Fs1"],
  [],
];
const verseGroove = [
  ["B0", "Fs1"], //
  ["Fs1"],
  ["D1", "Fs1"],
  ["Fs1"],
  ["B0", "Fs1"],
  ["Fs1"],
  ["D1", "Fs1"],
  ["Fs1"],
];
const verseFill = [
  ["B0", "Fs1"], //
  ["Fs1"],
  ["D1", "Fs1"],
  ["Fs1"],
  ["B0", "Fs1"],
  ["G1"],
  ["A1", "D1"],
  ["Cs2", "D2"],
];
const variationGroove = [
  ["Cs2", "B0", "Fs1"], //
  ["Fs1"],
  ["D1", "Fs1"],
  ["Fs1"],
  ["B0", "Fs1"],
  ["Fs1"],
  ["D1", "Fs1"],
  ["A#1"],
];
const variationFill = [
  ["Cs2", "B0", "Fs1"], //
  ["Fs1"],
  ["D1", "Fs1"],
  ["Fs1"],
  ["B0", "Fs1"],
  ["G1"],
  ["B1", "D1"],
  ["Cs2", "C2", "D2"],
];
const chorusGroove = [
  ["Cs2", "B0", "Fs1"], //
  ["A#1"],
  ["D1", "Fs1"],
  ["Fs1"],
  ["B0", "Fs1"],
  ["A#1"],
  ["D1", "Fs1"],
  ["Fs1"],
];
const chorusFill = [
  ["Cs2", "B0", "Fs1"], //
  ["A#1"],
  ["D1", "Fs1"],
  ["Fs1"],
  ["B0", "Fs1"],
  ["G1"],
  ["A1", "D1"],
  ["Cs2", "B1", "D2"],
];
const soloGroove = [
  ["Cs2", "B0", "D#2"], //
  ["D#2"],
  ["D1", "D#2"],
  ["D#2"],
  ["B0", "D#2"],
  ["D#2"],
  ["D1", "D#2"],
  ["D#2"],
];
const soloFill = [
  ["Cs2", "B0", "D#2"], //
  ["D#2"],
  ["D1", "D#2"],
  ["D#2"],
  ["B0", "D#2"],
  ["F1"],
  ["A1", "D1"],
  ["Cs2", "C2", "D2"],
];

const expandBar = (beats: string[][]): string[][] =>
  beats.reduce<string[][]>((expanded, beat) => {
    expanded.push(beat, [], [], []);
    return expanded;
  }, []);

const buildFourBarPattern = (groove: string[][], fill: string[][]): string[][] => [
  ...expandBar(groove), //
  ...expandBar(groove),
  ...expandBar(groove),
  ...expandBar(fill),
];

export const song_04: MDSong = {
  name: "Balada do Coração",
  gender: SONG_GENDERS.BALLAD,
  time: 4,
  bpm: 73,
  repeat: false,
  prompt: "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-04.mts` que seja um ritmo de música lenta/romântica/balada, com viradas e ataques.\n\nFaça uma música completa de aproximadamente 3 minutos e meio, com introdução, verso, variação, refrão e solo, na ordem que você desejar.\n\nPara saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\nNo novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\nNesta sessão, não edite a classe `MDPlayer`.",
  data: {
    tracks: [
      {
        parts: [
          {
            repeat: 1,
            beats: [
              { data: buildFourBarPattern(introGroove, introGroove), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFill), repeat: 3 },
              { data: buildFourBarPattern(variationGroove, variationFill), repeat: 2 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 3 },
              { data: buildFourBarPattern(verseGroove, verseFill), repeat: 2 },
              { data: buildFourBarPattern(variationGroove, variationFill), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 2 },
              { data: buildFourBarPattern(soloGroove, soloFill), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 1 },
            ],
          },
        ],
      },
    ],
  },
};
