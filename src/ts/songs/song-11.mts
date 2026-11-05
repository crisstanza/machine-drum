import { INSTRUMENTS, SONG_GENDERS, SONG_KEYS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const drumBar = (crash = false, fill = false, extraKick = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  for (let step = 0; step < 32; step += 4) {
    data[step].push("Fs1");
  }
  for (const step of [0, 16]) {
    data[step].push("B0");
  }
  for (const step of [8, 24]) {
    data[step].push("D1");
  }
  if (extraKick) {
    data[12].push("B0");
    data[28].push("B0");
  }
  if (crash) {
    data[0].push("Cs2");
  }
  if (fill) {
    data[20].push("G1");
    data[24].push("A1");
    data[28].push("B1");
    data[30].push("D2");
  }
  return data;
};

const bassBar = (notes: string[]): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  notes.forEach((note, index) => data[index * 4].push(note));
  return data;
};

const guitarBar = (chord: string[], syncopated = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  for (const step of syncopated ? [0, 6, 16, 22] : [0, 8, 16, 24]) {
    data[step].push(...chord);
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
const part = (data: string[][]) => ({ repeat: 1, beats: [{ repeat: 1, data }] });
const silence = (): string[][] => Array.from({ length: 128 }, () => []);

const introDrums = fourBars([drumBar(true), drumBar(), drumBar(), drumBar(false, true)]);
const verseOneDrums = fourBars([drumBar(), drumBar(false, false, true), drumBar(), drumBar(false, true)]);
const verseTwoDrums = fourBars([drumBar(true), drumBar(false, false, true), drumBar(), drumBar(false, true)]);
const chorusDrums = fourBars([drumBar(true, false, true), drumBar(false, false, true), drumBar(), drumBar(true, true, true)]);
const verseThreeDrums = fourBars([drumBar(), drumBar(false, false, true), drumBar(true), drumBar(false, true)]);
const bridgeDrums = fourBars([drumBar(true), drumBar(), drumBar(), drumBar(false, true, true)]);
const soloDrums = fourBars([drumBar(true, false, true), drumBar(false, false, true), drumBar(), drumBar(false, true, true), drumBar(true, false, true), drumBar(false, false, true), drumBar(), drumBar(false, true, true)]);
const outroDrums = fourBars([drumBar(true, false, true), drumBar(false, false, true), drumBar(true), drumBar(true, true)]);

const introBass = fourBars([bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["A0", "A0", "E1", "A0", "A0", "E1", "G1", "A0"]), bassBar(["B0", "B0", "Fs1", "B0", "B0", "Fs1", "A0", "B0"])]);
const verseOneBass = fourBars([bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["G0", "G0", "D1", "G0", "G0", "D1", "F1", "G0"]), bassBar(["A0", "A0", "E1", "A0", "A0", "E1", "G1", "A0"]), bassBar(["B0", "B0", "Fs1", "B0", "B0", "Fs1", "D1", "B0"])]);
const verseTwoBass = fourBars([bassBar(["E0", "B0", "E0", "B0", "E0", "B0", "D1", "B0"]), bassBar(["G0", "D1", "G0", "D1", "G0", "D1", "F1", "D1"]), bassBar(["A0", "E1", "A0", "E1", "A0", "E1", "G1", "E1"]), bassBar(["B0", "Fs1", "B0", "Fs1", "B0", "Fs1", "D1", "Fs1"])]);
const chorusBass = fourBars([bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["D1", "D1", "A0", "D1", "D1", "A0", "C1", "D1"]), bassBar(["A0", "A0", "E1", "A0", "A0", "E1", "G1", "A0"]), bassBar(["B0", "B0", "Fs1", "B0", "B0", "Fs1", "D1", "B0"])]);
const verseThreeBass = fourBars([bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["G0", "G0", "D1", "G0", "G0", "D1", "F1", "G0"]), bassBar(["A0", "A0", "E1", "A0", "A0", "E1", "G1", "A0"]), bassBar(["B0", "B0", "Fs1", "B0", "B0", "Fs1", "D1", "B0"])]);
const bridgeBass = fourBars([bassBar(["C1", "C1", "G0", "C1", "C1", "G0", "A0", "C1"]), bassBar(["D1", "D1", "A0", "D1", "D1", "A0", "C1", "D1"]), bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["B0", "B0", "Fs1", "B0", "B0", "Fs1", "D1", "B0"])]);
const soloBass = fourBars([bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["D1", "D1", "A0", "D1", "D1", "A0", "C1", "D1"]), bassBar(["A0", "A0", "E1", "A0", "A0", "E1", "G1", "A0"]), bassBar(["B0", "B0", "Fs1", "B0", "B0", "Fs1", "D1", "B0"]), bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["D1", "D1", "A0", "D1", "D1", "A0", "C1", "D1"]), bassBar(["A0", "A0", "E1", "A0", "A0", "E1", "G1", "A0"]), bassBar(["B0", "B0", "Fs1", "B0", "B0", "Fs1", "D1", "B0"])]);
const outroBass = fourBars([bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"]), bassBar(["D1", "D1", "A0", "D1", "D1", "A0", "C1", "D1"]), bassBar(["A0", "A0", "E1", "A0", "A0", "E1", "G1", "A0"]), bassBar(["E0", "E0", "B0", "E0", "E0", "B0", "D1", "E0"])]);

const introGuitar = fourBars([guitarBar(["E0", "B0", "E1"]), guitarBar(["E0", "B0", "E1"], true), guitarBar(["A0", "E1", "A1"]), guitarBar(["B0", "Fs1", "B1"], true)]);
const verseOneGuitar = fourBars([guitarBar(["E0", "B0", "E1"], true), guitarBar(["G0", "D1", "G1"], true), guitarBar(["A0", "E1", "A1"], true), guitarBar(["B0", "Fs1", "B1"], true)]);
const verseTwoGuitar = fourBars([guitarBar(["E0", "B0", "E1"], true), guitarBar(["G0", "D1", "G1"], true), guitarBar(["A0", "E1", "A1"], true), guitarBar(["B0", "Fs1", "B1"], true)]);
const chorusGuitar = fourBars([guitarBar(["E0", "B0", "E1"]), guitarBar(["D1", "A0", "D2"]), guitarBar(["A0", "E1", "A1"]), guitarBar(["B0", "Fs1", "B1"])]);
const verseThreeGuitar = fourBars([guitarBar(["E0", "B0", "E1"], true), guitarBar(["G0", "D1", "G1"], true), guitarBar(["A0", "E1", "A1"], true), guitarBar(["B0", "Fs1", "B1"], true)]);
const bridgeGuitar = fourBars([guitarBar(["C1", "G0", "C2"]), guitarBar(["D1", "A0", "D2"]), guitarBar(["E0", "B0", "E1"]), guitarBar(["B0", "Fs1", "B1"], true)]);
const soloGuitar = fourBars([guitarBar(["E0", "B0", "E1"]), guitarBar(["D1", "A0", "D2"]), guitarBar(["A0", "E1", "A1"]), guitarBar(["B0", "Fs1", "B1"]), guitarBar(["E0", "B0", "E1"]), guitarBar(["D1", "A0", "D2"]), guitarBar(["A0", "E1", "A1"]), guitarBar(["B0", "Fs1", "B1"])]);
const outroGuitar = fourBars([guitarBar(["E0", "B0", "E1"]), guitarBar(["D1", "A0", "D2"]), guitarBar(["A0", "E1", "A1"]), guitarBar(["E0", "B0", "E1"])]);

const soloLeadFirst = fourBars([melodyBar(["E4", null, "G4", "A4", "B4", null, "A4", "G4"]), melodyBar(["Fs4", null, "A4", "B4", "D5", null, "B4", "A4"]), melodyBar(["E4", "G4", "A4", null, "B4", "A4", "G4", "E4"]), melodyBar(["D4", null, "Fs4", "A4", "B4", null, "A4", "Fs4"])]);
const soloLeadSecond = fourBars([melodyBar(["E4", "G4", "B4", "E5", "D5", "B4", "A4", "G4"]), melodyBar(["Fs4", "A4", "D5", null, "B4", "A4", "Fs4", "D4"]), melodyBar(["A4", null, "B4", "D5", "E5", null, "D5", "B4"]), melodyBar(["E5", "D5", "B4", "A4", "G4", "A4", "B4", "E5"])]);
const finalLead = fourBars([melodyBar(["E5", null, "D5", null, "B4", null, "A4", null]), melodyBar(["G4", null, "A4", null, "B4", null, "D5", null]), melodyBar(["E5", null, null, null, "B4", null, "A4", null]), melodyBar(["E5", null, null, null, null, null, null, null])]);

export const song_11: MDSong = {
  name: "Fogo na Estrada",
  gender: SONG_GENDERS.ROCK,
  key: SONG_KEYS.E,
  timeSignature: {
    topNumber: 4,
    bottomNumber: 4,
  },
  bpm: 156,
  repeat: false,
  prompt:
    "Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-XX.mts` que seja uma música no estilo ROCK com bateria, guitarra, guitarra solo e baixo.\n\n" +
    "Faça uma música completa com essa estrutura:\n\n" +
    "- 4 compassos de introdução\n" +
    "- 4 compassos para o primeiro verso\n" +
    "- 4 compassos para o segundo verso\n" +
    "- 4 compassos para o refrão\n" +
    "- 4 compassos para o terceiro verso\n" +
    "- 4 compassos para a ponte\n" +
    "- 8 compassos para o solo\n" +
    "- 4 compassos repetindo o refrão\n" +
    "- 4 compassos para final\n\n" +
    "As trilhas devem ser 4:\n" +
    "- bateria\n" +
    "- baixo\n" +
    "- guitarra base\n" +
    "- guitarra solo\n\n" +
    "O campo `name` das trilhas deve ser preenchido.\n\n" +
    "Para o baixo e para a guitarra base, utilize oitavas bem baixas. Para a guitarra solo, utilize as oitavas mais agudas.\n\n" +
    "Para saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\n" +
    'As notas de baixo são os arquivos na pasta `src/audio/bass` e as da guitarra, na pasta `src/audio/guitar-clean` onde os números representam a oitava e a letra `s` significa "sustenido". Caso você precise utilizar alguma nota "bemol", utilize o arquivo de som equivalente, por exemplo, se você precisa de um sol bemol, utilize a marcação do fá sustenido.\n\n' +
    "No novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\n" +
    "Nesta sessão, não altere a classe `MDPlayer` em absolutamente nada.",
  data: {
    tracks: [
      {
        name: "Bateria",
        instrument: INSTRUMENTS.DRUMS,
        mute: false,
        parts: [part(introDrums), part(verseOneDrums), part(verseTwoDrums), part(chorusDrums), part(verseThreeDrums), part(bridgeDrums), part(soloDrums), part(chorusDrums), part(outroDrums)],
      },
      {
        name: "Baixo",
        instrument: INSTRUMENTS.BASS,
        mute: false,
        parts: [part(introBass), part(verseOneBass), part(verseTwoBass), part(chorusBass), part(verseThreeBass), part(bridgeBass), part(soloBass), part(chorusBass), part(outroBass)],
      },
      {
        name: "Guitarra base",
        instrument: INSTRUMENTS.GUITAR_CLEAN,
        mute: false,
        parts: [part(introGuitar), part(verseOneGuitar), part(verseTwoGuitar), part(chorusGuitar), part(verseThreeGuitar), part(bridgeGuitar), part(soloGuitar), part(chorusGuitar), part(outroGuitar)],
      },
      {
        name: "Guitarra solo",
        instrument: INSTRUMENTS.GUITAR_CLEAN,
        mute: false,
        parts: [part(silence()), part(silence()), part(silence()), part(silence()), part(silence()), part(silence()), part([...soloLeadFirst, ...soloLeadSecond]), part(silence()), part(finalLead)],
      },
    ],
  },
};
