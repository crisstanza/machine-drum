import { INSTRUMENTS, SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const drumBar = (chorus = false, fill = false, crash = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  for (let step = 0; step < 32; step += 4) {
    data[step].push([4, 12, 20, 28].includes(step) ? "As1" : "Fs1");
  }
  for (let step = 0; step < 32; step += 8) {
    data[step].push("B0");
  }
  data[8].push("D1");
  data[24].push("D1");
  if (chorus) {
    data[8].push("Ds1", "Fs2");
    data[24].push("Ds1", "Fs2");
  }
  if (crash) {
    data[0].push("Cs2");
  }
  if (fill) {
    data[24].push("G1");
    data[26].push("A1");
    data[28].push("B1");
    data[30].push("D2");
  }
  return data;
};

const bassBar = (root: string, fifth: string, octave: string, approach?: string): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  const notes = [root, fifth, octave, fifth, root, fifth, octave, fifth];
  notes.forEach((note, index) => data[index * 4].push(note));
  if (approach) {
    data[30].push(approach);
  }
  return data;
};

const guitarBar = (chord: string[], accents = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  for (const step of [4, 12, 20, 28]) {
    data[step].push(...chord);
  }
  if (accents) {
    data[8].push(...chord);
    data[24].push(...chord);
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

const restBar = (): string[][] => Array.from({ length: 32 }, () => []);
const fourBars = (bars: string[][][]): string[][] => bars.flat();
const part = (data: string[][], repeat = 1) => ({ repeat, beats: [{ repeat: 1, data }] });

const introDrums = fourBars([drumBar(false, false, true), drumBar(), drumBar(), drumBar(false, true)]);
const verseDrums = fourBars([drumBar(), drumBar(), drumBar(), drumBar(false, true)]);
const variationDrums = fourBars([drumBar(), drumBar(), drumBar(false, false, true), drumBar(false, true)]);
const chorusDrums = fourBars([drumBar(true, false, true), drumBar(true), drumBar(true), drumBar(true, true, true)]);
const soloDrums = fourBars([drumBar(false, false, true), drumBar(), drumBar(), drumBar(false, true)]);
const outroDrums = fourBars([drumBar(true, false, true), drumBar(true), drumBar(), drumBar(false, true)]);

const introBass = fourBars([bassBar("A1", "E2", "A2"), bassBar("A1", "E2", "A2"), bassBar("D2", "A2", "D3"), bassBar("E1", "B1", "E2", "Ds2")]);
const verseBass = fourBars([bassBar("A1", "E2", "A2"), bassBar("D2", "A2", "D3"), bassBar("Fs1", "Cs2", "Fs2"), bassBar("E1", "B1", "E2", "Ds2")]);
const variationBass = fourBars([bassBar("D2", "A2", "D3"), bassBar("E1", "B1", "E2", "Ds2"), bassBar("A1", "E2", "A2"), bassBar("E1", "B1", "E2", "Gs1")]);
const chorusBass = fourBars([bassBar("A1", "E2", "A2"), bassBar("Fs1", "Cs2", "Fs2"), bassBar("D2", "A2", "D3"), bassBar("E1", "B1", "E2", "Gs1")]);
const soloBass = fourBars([bassBar("A1", "E2", "A2"), bassBar("D2", "A2", "D3"), bassBar("Fs1", "Cs2", "Fs2"), bassBar("E1", "B1", "E2", "Gs1")]);
const outroBass = fourBars([bassBar("A1", "E2", "A2"), bassBar("D2", "A2", "D3"), bassBar("E1", "B1", "E2"), bassBar("A1", "E2", "A2")]);

const introGuitar = fourBars([guitarBar(["A2", "Cs3", "E3"]), guitarBar(["A2", "Cs3", "E3"]), guitarBar(["D3", "Fs3", "A3"]), guitarBar(["E3", "Gs3", "B3"], true)]);
const verseGuitar = fourBars([guitarBar(["A2", "Cs3", "E3"]), guitarBar(["D3", "Fs3", "A3"]), guitarBar(["Fs2", "As2", "Cs3"]), guitarBar(["E3", "Gs3", "B3"], true)]);
const variationGuitar = fourBars([guitarBar(["D3", "Fs3", "A3"], true), guitarBar(["E3", "Gs3", "B3"]), guitarBar(["A2", "Cs3", "E3"], true), guitarBar(["E3", "Gs3", "B3"], true)]);
const chorusGuitar = fourBars([guitarBar(["A2", "Cs3", "E3"], true), guitarBar(["Fs2", "As2", "Cs3"], true), guitarBar(["D3", "Fs3", "A3"], true), guitarBar(["E3", "Gs3", "B3"], true)]);
const soloGuitar = fourBars([melodyBar(["A3", null, null, null, "E4", null, null, null]), melodyBar(["Cs4", null, null, null, "B3", null, null, null]), melodyBar(["E4", null, "Fs4", null, "A4", null, null, null]), melodyBar(["Gs4", null, null, null, "E4", null, null, null])]);
const outroGuitar = fourBars([guitarBar(["A2", "Cs3", "E3"], true), guitarBar(["D3", "Fs3", "A3"]), guitarBar(["E3", "Gs3", "B3"]), melodyBar(["A3", null, null, null, "E4", null, null, null])]);
const finalDrums: string[][] = [["B0", "Cs2"], ...Array.from({ length: 3 }, () => [])];
const finalBass: string[][] = [["A1"], ...Array.from({ length: 3 }, () => [])];
const finalGuitar: string[][] = [["A3"], ...Array.from({ length: 3 }, () => [])];
const finalRest: string[][] = Array.from({ length: 4 }, () => []);
const silentSection = fourBars([restBar(), restBar(), restBar(), restBar()]);

export const song_10: MDSong = {
  name: "Brilho da Meia-Noite",
  gender: SONG_GENDERS.DISCO,
  timeSignature: {
    topNumber: 4,
    bottomNumber: 4,
  },
  bpm: 135,
  repeat: false,
  prompt:
    "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-XX.mts` que seja uma música no estilo DISCO com baixo e bateria, base de guitarra e uma parte com solo de guitarra.\n\n" +
    "Faça uma música completa de aproximadamente 2 minutos e 15 segundos, com introdução, verso, variação, refrão e solo, na ordem que você desejar.\n\n" +
    "A música deve ser bem alegre, divertida e dançante, como as músicas DISCO MUSIC dos anos 70. Para o solo de guitarra, em alguns momentos, utilize notas bem longas.\n\n" +
    "Para saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\n" +
    'As notas de baixo são os arquivos na pasta `src/audio/bass` e as da guitarra, na pasta `src/audio/guitar-clean` onde os números representam a oitava e a letra `s` significa "sustenido". Caso você precise utilizar alguma nota "bemol", utilize o arquivo de som equivalente, por exemplo, se você precisa de um sol bemol, utilize a marcação do fá sustenido.\n\n' +
    "No novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\n" +
    "Nesta sessão, não altere a classe `MDPlayer` em absolutamente nada.",
  data: {
    tracks: [
      {
        instrument: INSTRUMENTS.DRUMS,
        mute: false,
        parts: [part(introDrums), part(verseDrums, 3), part(variationDrums, 2), part(chorusDrums, 3), part(verseDrums, 2), part(chorusDrums, 3), part(soloDrums, 2), part(chorusDrums), part(outroDrums), part(finalDrums)],
      },
      {
        instrument: INSTRUMENTS.BASS,
        mute: false,
        parts: [part(introBass), part(verseBass, 3), part(variationBass, 2), part(chorusBass, 3), part(verseBass, 2), part(chorusBass, 3), part(soloBass, 2), part(chorusBass), part(outroBass), part(finalBass)],
      },
      {
        instrument: INSTRUMENTS.GUITAR_CLEAN,
        mute: false,
        parts: [part(introGuitar), part(verseGuitar, 3), part(variationGuitar, 2), part(chorusGuitar, 3), part(verseGuitar, 2), part(chorusGuitar, 3), part(chorusGuitar, 2), part(chorusGuitar), part(outroGuitar), part(finalGuitar)],
      },
      {
        instrument: INSTRUMENTS.GUITAR_CLEAN,
        mute: false,
        parts: [
          part(silentSection),
          part(silentSection, 3),
          part(silentSection, 2),
          part(silentSection, 3),
          part(silentSection, 2),
          part(silentSection, 3),
          part(soloGuitar, 2),
          part(silentSection),
          part(silentSection),
          part(finalRest),
        ],
      },
    ],
  },
};
