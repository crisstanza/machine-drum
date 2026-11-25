import { INSTRUMENTS, SONG_GENDERS, SONG_KEYS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

type BluesHarmony = {
  chord: string[];
  bass: [string, string, string, string, string, string, string, string];
  lick: [string, string, string, string];
};

type DrumPattern = {
  intensity: 0 | 1 | 2;
  fill?: boolean;
  crash?: boolean;
};

const A7: BluesHarmony = {
  chord: ["A2", "C3", "E3", "G3"],
  bass: ["A0", "E1", "A0", "G0", "A0", "E1", "G0", "C1"],
  lick: ["E4", "G4", "A4", "C5"],
};

const D7: BluesHarmony = {
  chord: ["D3", "Fs3", "A3", "C4"],
  bass: ["D1", "A1", "D1", "C2", "D1", "A1", "C2", "C1"],
  lick: ["D4", "F4", "G4", "A4"],
};

const E7: BluesHarmony = {
  chord: ["E3", "Gs3", "B3", "D4"],
  bass: ["E1", "B1", "E1", "D2", "E1", "B1", "D2", "G1"],
  lick: ["E4", "G4", "A4", "B4"],
};

const pianoBar = (harmony: BluesHarmony, flourish = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  data[0].push(...harmony.chord);
  data[4].push(harmony.lick[0]);
  data[8].push(harmony.chord[1], harmony.chord[2]);
  data[12].push(harmony.lick[1]);
  data[16].push(...harmony.chord);
  data[20].push(harmony.lick[2]);
  data[24].push(harmony.chord[1], harmony.chord[3]);
  data[28].push(harmony.lick[3]);
  if (flourish) {
    data[30].push("Ds5");
  }
  return data;
};

const pianoSection = (harmony: BluesHarmony[], flourish = false): string[][] =>
  harmony.flatMap((bar, index) => pianoBar(bar, flourish && index === harmony.length - 1));

const bassBar = (harmony: BluesHarmony): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  const swingSteps = [0, 6, 8, 14, 16, 22, 24, 30];
  harmony.bass.forEach((note, index) => data[swingSteps[index]].push(note));
  return data;
};

const bassSection = (harmony: BluesHarmony[]): string[][] => harmony.flatMap(bassBar);

const drumBar = ({ intensity, fill = false, crash = false }: DrumPattern): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  if (crash) {
    data[0].push("Cs2");
  }

  data[0].push("B0");
  data[16].push("B0");
  data[8].push("D1");
  data[24].push("D1");

  const hiHatSteps = intensity === 0 ? [0, 8, 16, 24] : [0, 6, 8, 14, 16, 22, 24, 30];
  hiHatSteps.forEach((step) => data[step].push("Fs1"));

  if (intensity >= 1) {
    for (const step of [0, 8, 16, 24]) {
      data[step].push("Ds2");
    }
  }
  if (intensity === 2) {
    data[12].push("C1");
    data[28].push("C1");
    data[14].push("As1");
    data[30].push("As1");
  }
  if (fill) {
    data[20].push("G1");
    data[22].push("A1");
    data[24].push("B1");
    data[26].push("D2");
    data[28].push("G1");
    data[30].push("D2");
  }
  return data;
};

const drumSection = (patterns: DrumPattern[]): string[][] => patterns.flatMap((pattern) => drumBar(pattern));
const part = (data: string[][]) => ({ repeat: 1, beats: [{ repeat: 1, data }] });

const introHarmony = [A7, A7, D7, E7];
const verseOneHarmony = [A7, A7, A7, A7];
const verseTwoHarmony = [D7, D7, A7, A7];
const verseThreeHarmony = [E7, D7, A7, E7];
const variationOneHarmony = [A7, D7, A7, E7];
const variationTwoHarmony = [D7, A7, E7, E7];
const finalOneHarmony = [A7, A7, D7, D7];
const finalTwoHarmony = [A7, E7, D7, E7];
const finalThreeHarmony = [A7, D7, E7, A7];

const introPiano = pianoSection(introHarmony);
const verseOnePiano = pianoSection(verseOneHarmony);
const verseTwoPiano = pianoSection(verseTwoHarmony);
const verseThreePiano = pianoSection(verseThreeHarmony, true);
const variationOnePiano = pianoSection(variationOneHarmony, true);
const variationTwoPiano = pianoSection(variationTwoHarmony, true);
const finalOnePiano = pianoSection(finalOneHarmony, true);
const finalTwoPiano = pianoSection(finalTwoHarmony, true);
const finalThreePiano = pianoSection(finalThreeHarmony, true);

const introBass = bassSection(introHarmony);
const verseOneBass = bassSection(verseOneHarmony);
const verseTwoBass = bassSection(verseTwoHarmony);
const verseThreeBass = bassSection(verseThreeHarmony);
const variationOneBass = bassSection(variationOneHarmony);
const variationTwoBass = bassSection(variationTwoHarmony);
const finalOneBass = bassSection(finalOneHarmony);
const finalTwoBass = bassSection(finalTwoHarmony);
const finalThreeBass = bassSection(finalThreeHarmony);

const introDrums = drumSection([
  { intensity: 0, crash: true },
  { intensity: 0 },
  { intensity: 1 },
  { intensity: 1, fill: true },
]);

const verseOneDrums = drumSection([
  { intensity: 1 },
  { intensity: 1 },
  { intensity: 1 },
  { intensity: 2, fill: true },
]);

const verseTwoDrums = drumSection([
  { intensity: 2, crash: true },
  { intensity: 2 },
  { intensity: 1 },
  { intensity: 2, fill: true },
]);

const verseThreeDrums = drumSection([
  { intensity: 2, crash: true },
  { intensity: 2 },
  { intensity: 2 },
  { intensity: 2, fill: true },
]);

const variationOneDrums = drumSection([
  { intensity: 2, crash: true },
  { intensity: 2 },
  { intensity: 2 },
  { intensity: 2, fill: true },
]);

const variationTwoDrums = drumSection([
  { intensity: 2, crash: true },
  { intensity: 2 },
  { intensity: 2, fill: true },
  { intensity: 2, fill: true },
]);

const finalOneDrums = drumSection([
  { intensity: 2, crash: true },
  { intensity: 2 },
  { intensity: 2 },
  { intensity: 2, fill: true },
]);

const finalTwoDrums = drumSection([
  { intensity: 2, crash: true },
  { intensity: 2, fill: true },
  { intensity: 2 },
  { intensity: 2, fill: true },
]);

const finalThreeDrums = drumSection([
  { intensity: 2, crash: true },
  { intensity: 2 },
  { intensity: 2, fill: true },
  { intensity: 2, fill: true },
]);

export const song_13: MDSong = {
  name: "Blues da Estrada",
  gender: SONG_GENDERS.BLUES,
  key: SONG_KEYS.A,
  timeSignature: {
    topNumber: 4,
    bottomNumber: 4,
  },
  bpm: 96,
  subdivisions: 8,
  repeat: false,
  prompt:
    "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-XX.mts` que seja uma música no estilo BLUES com piano, baixo e bateria. Crie uma bateria bem completa e empolgante.\n\n" +
    "Faça uma música completa de aproximadamente 90 segundos, com introdução, verso, variação e parte final.\n\n" +
    "Para saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\n" +
    "As notas do piano são os arquivos na pasta `src/audio/piano` e as do baixo, os da pasta `src/audio/bass`, onde os números representam a oitava e a letra `s` significa `sustenido`. Dependendo do tom escolhido para a composição, caso você precise utilizar alguma nota `bemol`, utilize uma notação semelhante à das notas sustenido, por exemplo: `Eb1`. O player saberá carregar o arquivo correspondente.\n\n" +
    "Eu recomendo fazer no tom de `A` ou de `E`.\n\n" +
    "Para finalizar a música, adicione somente mais uma batida no final, que seja igual a primeira batida da música, em todas as trilhas. A idéia é que ao encerrar, se ouça a batida de tempo 1 (a cabeça do tempo) uma vez com a nota e o prato da bateria soando até o som encerrar.\n\n" +
    "No novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\n" +
    "Nesta sessão, não altere a classe `MDPlayer` em absolutamente nada, mas altere a classe `MDPlayerConstants`, incrementando a variável `MAX_SONG`.",
  data: {
    tracks: [
      {
        name: "Piano",
        instrument: INSTRUMENTS.PIANO,
        mute: false,
        parts: [
          part(introPiano),
          part(verseOnePiano),
          part(verseTwoPiano),
          part(verseThreePiano),
          part(variationOnePiano),
          part(variationTwoPiano),
          part(finalOnePiano),
          part(finalTwoPiano),
          part([...finalThreePiano, ...introPiano.slice(0, 8)]),
        ],
      },
      {
        name: "Baixo",
        instrument: INSTRUMENTS.BASS,
        mute: false,
        parts: [
          part(introBass),
          part(verseOneBass),
          part(verseTwoBass),
          part(verseThreeBass),
          part(variationOneBass),
          part(variationTwoBass),
          part(finalOneBass),
          part(finalTwoBass),
          part([...finalThreeBass, ...introBass.slice(0, 8)]),
        ],
      },
      {
        name: "Bateria",
        instrument: INSTRUMENTS.DRUMS,
        mute: false,
        parts: [
          part(introDrums),
          part(verseOneDrums),
          part(verseTwoDrums),
          part(verseThreeDrums),
          part(variationOneDrums),
          part(variationTwoDrums),
          part(finalOneDrums),
          part(finalTwoDrums),
          part([...finalThreeDrums, ...introDrums.slice(0, 8)]),
        ],
      },
    ],
  },
};
