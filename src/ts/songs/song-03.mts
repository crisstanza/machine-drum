import { INSTRUMENTS, SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const introGroove = [["Cs2", "B0"], [], ["Fs1"], [], ["Fs1", "D1"], [], ["Fs1"], [], ["B0", "Fs1"], [], ["Fs1"], [], ["Fs1", "D1"], [], ["G1"], ["A1"]];
const verseGroove = [["Fs1", "B0"], [], ["Fs1"], [], ["Fs1", "D1"], [], ["Fs1"], ["B0"], ["Fs1", "B0"], [], ["Fs1"], [], ["Fs1", "D1"], [], ["Fs1"], []];
const verseFill = [["Cs2", "B0", "Fs1"], [], ["Fs1"], [], ["Fs1", "D1"], [], ["Fs1"], ["B0"], ["Fs1", "B0"], [], ["G1"], ["A1"], ["B1", "D1"], ["C2"], ["D2"], ["Cs2", "D1"]];
const variationGroove = [["Fs1", "B0", "Cs2"], [], ["As1"], [], ["As1", "D1"], [], ["Fs1"], ["B0"], ["Fs1", "B0"], [], ["As1"], [], ["As1", "D1"], [], ["Gs1"], ["A1"]];
const variationFill = [["Cs2", "B0", "Fs1"], [], ["As1"], [], ["As1", "D1"], [], ["Fs1"], ["B0"], ["Fs1", "B0"], [], ["G1"], ["A1"], ["B1", "D1"], ["C2"], ["D2"], ["Cs2", "D1"]];
const chorusGroove = [["Cs2", "B0", "Fs1"], [], ["Fs1"], ["B0"], ["Fs1", "D1"], [], ["Fs1"], ["B0"], ["Fs1", "B0"], [], ["Fs1"], ["B0"], ["Fs1", "D1"], [], ["Fs1"], []];
const chorusFill = [["Cs2", "B0", "Fs1"], [], ["Fs1"], ["B0"], ["Fs1", "D1"], [], ["Fs1"], ["B0"], ["Fs1", "B0"], [], ["G1"], ["A1"], ["B1", "D1"], ["C2"], ["D2"], ["Cs2", "D1"]];
const soloGroove = [["Cs2", "B0", "Ds2"], [], ["Ds2"], ["B0"], ["Ds2", "D1"], [], ["Ds2"], ["B0"], ["Ds2", "B0"], [], ["Ds2"], ["B0"], ["Ds2", "D1"], [], ["Ds2"], []];
const soloFill = [["Cs2", "B0", "Ds2"], [], ["Ds2"], ["B0"], ["Ds2", "D1"], [], ["Ds2"], ["B0"], ["Ds2", "B0"], [], ["F1"], ["G1"], ["A1", "D1"], ["B1"], ["D2"], ["Cs2", "D1"]];

const expandBar = (beats: string[][]): string[][] =>
  beats.reduce<string[][]>((expanded, beat) => {
    expanded.push(beat, []);
    return expanded;
  }, []);

const buildFourBarPattern = (groove: string[][], fill: string[][]): string[][] => [
  ...expandBar(groove), //
  ...expandBar(groove),
  ...expandBar(groove),
  ...expandBar(fill),
];

export const song_03: MDSong = {
  gender: SONG_GENDERS.POP_ROCK,
  timeSignature: {
    topNumber: 4,
    bottomNumber: 4,
  },
  bpm: 116,
  repeat: false,
  prompt: "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-03.mts` que seja um ritmo de bateria pop/rock, com viradas e ataques.\n\nFaça uma música completa de aproximadamente 4 minutos, com introdução, verso, variação, refrão e solo, na ordem que você desejar.\n\nPara saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\nNo novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\nEdite a classe `MDPlayer` para ela referenciar o novo objeto `song` criado. Porém, nesta classe, jamais altere o método `calcStepDuration()`.",
  data: {
    tracks: [
      {
        instrument: INSTRUMENTS.DRUMS,
        mute: false,
        parts: [
          {
            repeat: 1,
            beats: [
              { data: buildFourBarPattern(introGroove, introGroove), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFill), repeat: 4 },
              { data: buildFourBarPattern(variationGroove, variationFill), repeat: 2 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 4 },
              { data: buildFourBarPattern(verseGroove, verseFill), repeat: 4 },
              { data: buildFourBarPattern(variationGroove, variationFill), repeat: 2 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 4 },
              { data: buildFourBarPattern(soloGroove, soloFill), repeat: 4 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 4 },
            ],
          },
        ],
      },
    ],
  },
};
