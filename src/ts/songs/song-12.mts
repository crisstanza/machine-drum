import { INSTRUMENTS, SONG_GENDERS, SONG_KEYS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

type PianoBar = {
  chord: string[];
  arpeggio: [string, string];
  melody: [string, string, string, string];
};

const pianoBar = ({ chord, arpeggio, melody }: PianoBar): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  data[0].push(...chord);
  data[4].push(melody[0]);
  data[8].push(arpeggio[0]);
  data[12].push(melody[1]);
  data[16].push(arpeggio[1]);
  data[20].push(melody[2]);
  data[24].push(arpeggio[0]);
  data[28].push(melody[3]);
  return data;
};

const pianoSection = (bars: PianoBar[]): string[][] => bars.flatMap(pianoBar);

const drumBar = (level: "soft" | "steady" | "full", fill = false, crash = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  if (crash) {
    data[0].push("Cs2");
  }
  data[0].push("B0");
  data[16].push("B0");

  if (level !== "soft") {
    data[8].push("D1");
    data[24].push("D1");
  } else {
    data[16].push("Cs1");
  }

  if (level === "full") {
    for (const step of [0, 8, 16, 24]) {
      data[step].push("Fs1");
    }
    data[12].push("B0");
  } else if (level === "steady") {
    for (const step of [0, 16]) {
      data[step].push("Fs1");
    }
  }

  if (fill) {
    data[20].push("G1");
    data[24].push("A1");
    data[28].push("B1");
    data[30].push("D2");
  }
  return data;
};

const drumSection = (bars: string[][][]): string[][] => bars.flat();
const part = (data: string[][]) => ({ repeat: 1, beats: [{ repeat: 1, data }] });

const introPiano = pianoSection([
  { chord: ["C2", "G2", "C3", "E3", "G3"], arpeggio: ["G3", "E3"], melody: ["G4", "E4", "D4", "C4"] }, //
  { chord: ["A1", "E2", "A2", "C3", "E3"], arpeggio: ["E3", "C3"], melody: ["E4", "C4", "B3", "A3"] },
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["C3", "A2"], melody: ["A4", "G4", "F4", "E4"] },
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["D3", "B2"], melody: ["D4", "B3", "A3", "G3"] },
]);

const verseOnePiano = pianoSection([
  { chord: ["C2", "G2", "C3", "E3", "G3"], arpeggio: ["G3", "E3"], melody: ["C5", "G4", "E4", "D4"] }, //
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["D3", "B2"], melody: ["B4", "G4", "D4", "B3"] },
  { chord: ["A1", "E2", "A2", "C3", "E3"], arpeggio: ["E3", "C3"], melody: ["A4", "E4", "C4", "B3"] },
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["C3", "A2"], melody: ["A4", "G4", "F4", "E4"] },
]);

const verseTwoPiano = pianoSection([
  { chord: ["C2", "G2", "C3", "E3", "G3"], arpeggio: ["E3", "G3"], melody: ["E5", "D5", "C5", "G4"] }, //
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["B2", "D3"], melody: ["D5", "B4", "A4", "G4"] },
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["A2", "C3"], melody: ["C5", "A4", "G4", "F4"] },
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["D3", "B2"], melody: ["B4", "A4", "G4", "D4"] },
]);

const variationOnePiano = pianoSection([
  { chord: ["A1", "E2", "A2", "C3", "E3"], arpeggio: ["C3", "E3"], melody: ["A4", "C5", "E5", "C5"] }, //
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["A2", "C3"], melody: ["A4", "G4", "F4", "C5"] },
  { chord: ["C2", "G2", "C3", "E3", "G3"], arpeggio: ["E3", "G3"], melody: ["G4", "E4", "C5", "G4"] },
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["B2", "D3"], melody: ["D5", "B4", "A4", "G4"] },
]);

const variationTwoPiano = pianoSection([
  { chord: ["D2", "A2", "D3", "F3", "A3"], arpeggio: ["F3", "A3"], melody: ["A4", "F4", "D5", "A4"] }, //
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["C3", "A2"], melody: ["C5", "A4", "G4", "F4"] },
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["D3", "B2"], melody: ["B4", "D5", "G4", "A4"] },
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["B2", "D3"], melody: ["D5", "B4", "A4", "G4"] },
]);

const climaxOnePiano = pianoSection([
  { chord: ["C2", "G2", "C3", "E3", "G3"], arpeggio: ["E3", "G3"], melody: ["G4", "C5", "E5", "G5"] }, //
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["B2", "D3"], melody: ["G5", "D5", "B4", "G4"] },
  { chord: ["A1", "E2", "A2", "C3", "E3"], arpeggio: ["C3", "E3"], melody: ["A4", "C5", "E5", "A5"] },
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["A2", "C3"], melody: ["A5", "G5", "F5", "C5"] },
]);

const climaxTwoPiano = pianoSection([
  { chord: ["D2", "A2", "D3", "F3", "A3"], arpeggio: ["F3", "A3"], melody: ["A4", "D5", "F5", "A5"] }, //
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["A2", "C3"], melody: ["A5", "G5", "F5", "C5"] },
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["B2", "D3"], melody: ["B4", "D5", "G5", "B5"] },
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["D3", "B2"], melody: ["D5", "B4", "A4", "G4"] },
]);

const finalOnePiano = pianoSection([
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["A2", "C3"], melody: ["C5", "A4", "F4", "A4"] }, //
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["B2", "D3"], melody: ["D5", "B4", "G4", "B4"] },
  { chord: ["E2", "B2", "E3", "G3", "B3"], arpeggio: ["G3", "B3"], melody: ["E5", "D5", "B4", "G4"] },
  { chord: ["A1", "E2", "A2", "C3", "E3"], arpeggio: ["C3", "E3"], melody: ["E5", "C5", "A4", "G4"] },
]);

const finalTwoPiano = pianoSection([
  { chord: ["F1", "C2", "F2", "A2", "C3"], arpeggio: ["A2", "C3"], melody: ["A4", "C5", "F5", "C5"] }, //
  { chord: ["G1", "D2", "G2", "B2", "D3"], arpeggio: ["B2", "D3"], melody: ["B4", "D5", "G5", "D5"] },
  { chord: ["C2", "G2", "C3", "E3", "G3"], arpeggio: ["E3", "G3"], melody: ["C5", "G4", "E4", "D4"] },
  { chord: ["C2", "G2", "C3", "E3", "G3"], arpeggio: ["G3", "E3"], melody: ["C5", "G4", "E4", "C4"] },
]);

const introDrums = drumSection([
  drumBar("soft", false, true), //
  drumBar("soft"),
  drumBar("soft"),
  drumBar("soft", true),
]);

const verseOneDrums = drumSection([
  drumBar("soft"), //
  drumBar("soft"),
  drumBar("steady"),
  drumBar("steady", true),
]);

const verseTwoDrums = drumSection([
  drumBar("steady", false, true), //
  drumBar("steady"),
  drumBar("steady"),
  drumBar("steady", true),
]);

const variationOneDrums = drumSection([
  drumBar("steady", false, true), //
  drumBar("steady"),
  drumBar("steady"),
  drumBar("steady", true),
]);

const variationTwoDrums = drumSection([
  drumBar("steady"), //
  drumBar("steady", false, true),
  drumBar("full"),
  drumBar("full", true),
]);

const climaxOneDrums = drumSection([
  drumBar("full", false, true), //
  drumBar("full"),
  drumBar("full"),
  drumBar("full", true),
]);

const climaxTwoDrums = drumSection([
  drumBar("full", false, true), //
  drumBar("full"),
  drumBar("full"),
  drumBar("full", true),
]);

const finalOneDrums = drumSection([
  drumBar("full", false, true), //
  drumBar("full"),
  drumBar("full"),
  drumBar("full", true),
]);

const finalTwoDrums = drumSection([
  drumBar("full", false, true), //
  drumBar("full"),
  drumBar("steady"),
  drumBar("soft", true),
]);

export const song_12: MDSong = {
  name: "Luz que Fica",
  gender: SONG_GENDERS.BALLAD,
  key: SONG_KEYS.C,
  timeSignature: {
    topNumber: 4,
    bottomNumber: 4,
  },
  bpm: 72,
  subdivisions: 8,
  repeat: false,
  volume: 0.5,
  prompt:
    "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-XX.mts` que seja uma música no estilo BALLAD com piano e bateria.\n\n" +
    "Faça uma música completa de aproximadamente 120 segundos, com introdução, verso, variação e parte final.\n\n" +
    "Para saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\n" +
    "As notas do piano são os arquivos na pasta `src/audio/piano`, onde os números representam a oitava e a letra `s` significa `sustenido`. Dependendo do tom escolhido para a composição, caso você precise utilizar alguma nota `bemol`, utilize uma notação semelhante à das notas sustenido, por exemplo: `Eb1`. O player saberá carregar o arquivo correspondente.\n\n" +
    "No novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\n" +
    "E para finalizar a música, adicione somente mais uma batida no final, que seja igual a primeira batida da música, em ambas as trilhas piano e bateria. A idéia é que ao encerrar, se ouça a batida de tempo 1 uma vez com a nota e o prato soando até o som encerrar.\n\n" +
    "Nesta sessão, não altere a classe `MDPlayer` em absolutamente nada.",
  data: {
    tracks: [
      {
        name: "Piano",
        instrument: INSTRUMENTS.PIANO,
        mute: false,
        volume: 1,
        parts: [
          part(introPiano), //
          part(verseOnePiano),
          part(verseTwoPiano),
          part(variationOnePiano),
          part(variationTwoPiano),
          part(climaxOnePiano),
          part(climaxTwoPiano),
          part(finalOnePiano),
          part([...finalTwoPiano, ...introPiano.slice(0, 2)]),
        ],
      },
      {
        name: "Bateria",
        instrument: INSTRUMENTS.DRUMS,
        mute: false,
        volume: 1,
        parts: [
          part(introDrums), //
          part(verseOneDrums),
          part(verseTwoDrums),
          part(variationOneDrums),
          part(variationTwoDrums),
          part(climaxOneDrums),
          part(climaxTwoDrums),
          part(finalOneDrums),
          part([...finalTwoDrums, ...introDrums.slice(0, 8)]),
        ],
      },
    ],
  },
};
