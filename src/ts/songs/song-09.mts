import { INSTRUMENTS, SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const drumBar = (extraKicks: number[] = [], crash = false, fill = false, ride = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  for (let step = 0; step < data.length; step += 4) {
    data[step].push(ride ? "D#2" : "Fs1");
  }
  data[0].push("B0");
  data[8].push("D1");
  data[16].push("B0");
  data[24].push("D1");
  for (const step of extraKicks) {
    data[step].push("B0");
  }
  if (crash) {
    data[0].push("Cs2");
  }
  if (fill) {
    data[20].push("G1");
    data[24].push("A1");
    data[28].push("B1");
    data[30].push("D2");
  } else {
    data[28].push("As1");
  }
  return data;
};

const bassBar = (root: string, fifth: string, octave: string, variation = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  for (let step = 0; step < data.length; step += 4) {
    const beat = step / 4;
    data[step].push(beat % 4 === 2 ? octave : beat % 2 === 0 ? root : fifth);
  }
  if (variation) {
    data[30].push(fifth);
  }
  return data;
};

const melodyBar = (notes: (string | null)[]): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  notes.forEach((note, index) => {
    if (note) {
      data[index * 4].push(note);
    }
  });
  return data;
};

const fourBars = (bars: string[][][]): string[][] => bars.flat();
const part = (data: string[][], repeat = 1) => ({ repeat, beats: [{ repeat: 1, data }] });

const introDrums = fourBars([drumBar([], true), drumBar([12]), drumBar([12, 28]), drumBar([12], true, true)]);
const verseDrums = fourBars([drumBar([12]), drumBar([28]), drumBar([12, 28]), drumBar([12], false, true)]);
const chorusDrums = fourBars([drumBar([12], true), drumBar([12, 28]), drumBar([12], true), drumBar([12, 28], true, true)]);
const soloDrums = fourBars([drumBar([12], true, false, true), drumBar([12, 28], false, false, true), drumBar([12], false, false, true), drumBar([12, 28], true, true, true)]);
const outroDrums = fourBars([drumBar([12], true), drumBar([12, 28]), drumBar([12], true), drumBar([], true, true)]);

const introBass = fourBars([bassBar("E1", "B1", "E2"), bassBar("E1", "B1", "E2"), bassBar("G1", "D2", "G2"), bassBar("D2", "A2", "D3", true)]);
const verseBass = fourBars([bassBar("E1", "B1", "E2"), bassBar("G1", "D2", "G2"), bassBar("A1", "E2", "A2"), bassBar("D2", "A2", "D3", true)]);
const chorusBass = fourBars([bassBar("C2", "G2", "C3"), bassBar("G1", "D2", "G2"), bassBar("D2", "A2", "D3"), bassBar("E1", "B1", "E2", true)]);
const soloBass = fourBars([bassBar("E1", "B1", "E2", true), bassBar("G1", "D2", "G2", true), bassBar("A1", "E2", "A2", true), bassBar("D2", "A2", "D3", true)]);
const outroBass = fourBars([bassBar("C2", "G2", "C3"), bassBar("D2", "A2", "D3"), bassBar("E1", "B1", "E2", true), bassBar("E1", "B1", "E2")]);

const introMelody = fourBars([melodyBar([null, "E3", "G3", "Fs3", "E3", null, "D3", "E3"]), melodyBar([null, null, "E3", "G3", "Fs3", "E3", "D3", "E3"]), melodyBar(["G3", null, "Fs3", "E3", "D3", null, "E3", "G3"]), melodyBar(["Fs3", "E3", "D3", "E3", "G3", "Fs3", "E3", null])]);
const verseMelody = fourBars([melodyBar(["E3", "E3", "G3", "Fs3", "E3", "D3", "E3", "G3"]), melodyBar(["G3", "G3", "Fs3", "E3", "D3", "E3", "Fs3", "G3"]), melodyBar(["C3", "C3", "E3", "E3", "G3", "Fs3", "E3", "D3"]), melodyBar(["D3", "D3", "Fs3", "E3", "D3", "E3", "Fs3", "E3"])]);
const chorusMelody = fourBars([melodyBar(["G3", "G3", "E3", "G3", "Fs3", "E3", "D3", "E3"]), melodyBar(["G3", "G3", "Fs3", "E3", "D3", "E3", "G3", "Fs3"]), melodyBar(["E3", "E3", "G3", "Fs3", "E3", "D3", "E3", "G3"]), melodyBar(["Fs3", "Fs3", "E3", "D3", "E3", "Fs3", "E3", null])]);
const verseTwoMelody = fourBars([melodyBar(["E3", "G3", "G3", "Fs3", "E3", "D3", "E3", "G3"]), melodyBar(["G3", "G3", "Fs3", "E3", "D3", "E3", "Fs3", "G3"]), melodyBar(["C3", "C3", "E3", "G3", "Fs3", "E3", "D3", "E3"]), melodyBar(["D3", "Fs3", "E3", "D3", "E3", "G3", "Fs3", "E3"])]);
const soloMelody = fourBars([melodyBar(["E3", "G3", "Fs3", "G3", "E3", "D3", "E3", "G3"]), melodyBar(["G3", "Fs3", "E3", "G3", "Fs3", "E3", "D3", "E3"]), melodyBar(["C3", "C3", "E3", "G3", "E3", "Fs3", "G3", "Fs3"]), melodyBar(["D3", "E3", "Fs3", "G3", "Fs3", "E3", "D3", "E3"])]);
const outroMelody = fourBars([melodyBar(["G3", "G3", "E3", "G3", "Fs3", "E3", "D3", "E3"]), melodyBar(["G3", "Fs3", "E3", "D3", "E3", "G3", "Fs3", "E3"]), melodyBar(["E3", "G3", "Fs3", "E3", "D3", "E3", "Fs3", "E3"]), melodyBar(["E3", null, "D3", null, "E3", null, null, null])]);

export const song_09: MDSong = {
  name: "Aço na Veia",
  gender: SONG_GENDERS.ROCK,
  time: 4,
  bpm: 184,
  repeat: false,
  prompt:
    "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-XX.mts` que seja uma música no estilo ROCK com baixo e bateria. Quero uma música bem rápida e com bastante pegada.\n\n" +
    "Faça uma música completa de aproximadamente 110 segundos, com introdução, verso, refrão e solo, na ordem que você desejar.\n\n" +
    "Para saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\n" +
    "As notas de baixo são os arquivos na pasta `src/audio/bass`, onde os números representam a oitava e a letra `s` significa `sustenido`. Caso você precise utilizar alguma nota `bemol`, utilize o arquivo de som equivalente, por exemplo, se você precisa de um sol bemol, utilize a marcação do fá sustenido.\n\n" +
    "No novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\n" +
    "Nesta sessão, não altere a classe `MDPlayer` em absolutamente nada.",
  data: {
    tracks: [
      {
        instrument: INSTRUMENTS.DRUMS,
        mute: false,
        parts: [
          part(introDrums), //
          part(verseDrums, 4),
          part(chorusDrums, 4),
          part(verseDrums, 3),
          part(chorusDrums, 4),
          part(soloDrums, 3),
          part(outroDrums, 2),
        ],
      },
      {
        instrument: INSTRUMENTS.BASS,
        mute: false,
        parts: [
          part(introBass), //
          part(verseBass, 4),
          part(chorusBass, 4),
          part(verseBass, 3),
          part(chorusBass, 4),
          part(soloBass, 3),
          part(outroBass, 2),
        ],
      },
      {
        instrument: INSTRUMENTS.BASS,
        mute: false,
        parts: [
          part(introMelody), //
          part(verseMelody, 4),
          part(chorusMelody, 4),
          part(verseTwoMelody, 3),
          part(chorusMelody, 4),
          part(soloMelody, 3),
          part(outroMelody, 2),
        ],
      },
    ],
  },
};
