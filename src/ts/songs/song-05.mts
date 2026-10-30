import { INSTRUMENTS, SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const pulse = (hit: string[] = [], roll: string[][] = []): string[][] => Array.from({ length: 4 }, (_, index) => (index === 0 ? hit : (roll[index - 1] ?? [])));

const bar = (pulses: string[][][]): string[][] => pulses.flat();

const buildFourBarPattern = (groove: string[][], fill: string[][]): string[][] => [
  ...groove, //
  ...groove,
  ...groove,
  ...fill,
];

const introGroove = bar([pulse(["Cs2", "B0"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["A2", "Cs2"])]);
const introFill = bar([pulse(["Cs2", "B0"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["G1"]), pulse(["A1"], [["D1"], ["D1"], ["D1"]]), pulse(["B1", "D1"], [["D1"], ["D1"], ["D1"]]), pulse(["Cs2", "D2"])]);

const verseGroove = bar([pulse(["B0", "Fs1"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"])]);
const verseFill = bar([pulse(["B0", "Fs1"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["G1"], [["D1"], ["D1"], ["D1"]]), pulse(["A1"], [["D1"], ["D1"], ["D1"]]), pulse(["Cs2", "D2"])]);
const verseFillAlt = bar([pulse(["Cs2", "B0", "Fs1"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["A1"], [["D1"], ["D1"], ["D1"]]), pulse(["B1"], [["D1"], ["D1"], ["D1"]]), pulse(["C2", "D2", "Cs2"])]);

const preChorusGroove = bar([pulse(["Cs2", "B0", "Fs1"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["A#1"])]);
const preChorusFill = bar([pulse(["Cs2", "B0", "Fs1"]), pulse(["Fs1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["G1"], [["D1"], ["D1"], ["D1"]]), pulse(["A1"], [["D1"], ["D1"], ["D1"]]), pulse(["A2", "D2", "Cs2"])]);

const chorusGroove = bar([pulse(["Cs2", "B0", "Fs1"]), pulse(["A#1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["A#1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"])]);
const chorusFill = bar([pulse(["Cs2", "B0", "Fs1"]), pulse(["A#1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["G1"], [["D1"], ["D1"], ["D1"]]), pulse(["B1"], [["D1"], ["D1"], ["D1"]]), pulse(["Cs2", "C2", "D2"])]);
const chorusFillAlt = bar([pulse(["A2", "B0", "Fs1"]), pulse(["A#1"]), pulse(["D1", "Fs1"]), pulse(["Fs1"]), pulse(["B0", "Fs1"]), pulse(["A1"], [["D1"], ["D1"], ["D1"]]), pulse(["C2"], [["D1"], ["D1"], ["D1"]]), pulse(["A2", "Cs2", "D2"])]);

const soloGroove = bar([pulse(["Cs2", "B0", "D#2"]), pulse(["D#2"]), pulse(["D1", "D#2"]), pulse(["D#2"]), pulse(["B0", "D#2"]), pulse(["D#2"]), pulse(["D1", "D#2"]), pulse(["D#2"])]);
const soloFill = bar([pulse(["Cs2", "B0", "D#2"]), pulse(["D#2"]), pulse(["D1", "D#2"]), pulse(["D#2"]), pulse(["B0", "D#2"]), pulse(["F1"], [["D1"], ["D1"], ["D1"]]), pulse(["G1"], [["D1"], ["D1"], ["D1"]]), pulse(["A1", "D1", "Cs2"])]);
const soloFillAlt = bar([pulse(["Cs2", "B0", "D#2"]), pulse(["D#2"]), pulse(["D1", "D#2"]), pulse(["D#2"]), pulse(["B0", "D#2"]), pulse(["G1"], [["D1"], ["D1"], ["D1"]]), pulse(["B1"], [["D1"], ["D1"], ["D1"]]), pulse(["C2", "D2", "A2"])]);

export const song_05: MDSong = {
  name: "Motor em Chamas",
  gender: SONG_GENDERS.ROCK,
  time: 4,
  bpm: 120,
  repeat: false,
  prompt: "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-XX.mts` que seja um ritmo do gênero ROCK, com várias viradas, ataques e longos rolos.\n\nFaça uma música completa de aproximadamente 2 minutos e 15 segundo, com introdução, verso, refrão e solo, na ordem que você achar melhor. Faça a música ser bem dinâmica e agitada.\n\nPara saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\nNo novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\nNesta sessão, não edite a classe `MDPlayer`.",
  data: {
    tracks: [
      {
        instrument: INSTRUMENTS.DRUMS,
        parts: [
          {
            repeat: 1,
            beats: [
              { data: buildFourBarPattern(introGroove, introFill), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFill), repeat: 2 },
              { data: buildFourBarPattern(verseGroove, verseFillAlt), repeat: 1 },
              { data: buildFourBarPattern(preChorusGroove, preChorusFill), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 2 },
              { data: buildFourBarPattern(chorusGroove, chorusFillAlt), repeat: 1 },
              { data: buildFourBarPattern(verseGroove, verseFillAlt), repeat: 2 },
              { data: buildFourBarPattern(preChorusGroove, preChorusFill), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFillAlt), repeat: 2 },
              { data: buildFourBarPattern(soloGroove, soloFill), repeat: 1 },
              { data: buildFourBarPattern(soloGroove, soloFillAlt), repeat: 1 },
              { data: buildFourBarPattern(chorusGroove, chorusFill), repeat: 2 },
            ],
          },
        ],
      },
    ],
  },
};
