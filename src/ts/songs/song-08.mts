import { INSTRUMENTS, SONG_GENDERS } from "../enums/enums.mjs";
import { MDSong } from "../types/types.mjs";

const drumBar = (kickOnOne = false, fill = false, openHat = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  for (let step = 0; step < data.length; step += 4) {
    data[step].push("Fs1");
  }
  data[16].push("B0", "D1");
  if (kickOnOne) {
    data[0].push("B0");
  }
  if (openHat) {
    data[28].push("As1");
  }
  if (fill) {
    data[24].push("Cs1");
    data[26].push("D1");
    data[28].push("A1");
    data[30].push("D2");
  }
  return data;
};

const bassBar = (root: string, fifth: string, busy = false): string[][] => {
  const data: string[][] = Array.from({ length: 32 }, () => []);
  data[0].push(root);
  data[12].push(fifth);
  data[16].push(root);
  data[28].push(busy ? root : fifth);
  if (busy) {
    data[8].push(fifth);
    data[24].push(fifth);
  }
  return data;
};

const fourBars = (bars: string[][][]): string[][] => bars.flat();
const part = (data: string[][], repeat = 1) => ({ repeat, beats: [{ repeat: 1, data }] });

const introDrums = fourBars([drumBar(), drumBar(), drumBar(), drumBar(false, true)]);
const verseDrums = fourBars([drumBar(), drumBar(), drumBar(true), drumBar(false, true)]);
const variationDrums = fourBars([drumBar(true), drumBar(), drumBar(true), drumBar(false, true, true)]);
const chorusDrums = fourBars([drumBar(true), drumBar(true), drumBar(true), drumBar(true, true, true)]);
const soloDrums = fourBars([drumBar(true), drumBar(true, false, true), drumBar(), drumBar(true, true)]);
const outroDrums = fourBars([drumBar(), drumBar(), drumBar(), drumBar()]);

const introBass = fourBars([bassBar("E1", "B1"), bassBar("E1", "B1"), bassBar("C2", "G1"), bassBar("D2", "A2")]);
const verseBass = fourBars([bassBar("E1", "B1"), bassBar("C2", "G1"), bassBar("G1", "D2"), bassBar("D2", "A2")]);
const variationBass = fourBars([bassBar("C2", "G1", true), bassBar("D2", "A2", true), bassBar("E1", "B1", true), bassBar("D2", "A2", true)]);
const chorusBass = fourBars([bassBar("G1", "D2", true), bassBar("D2", "A2", true), bassBar("E1", "B1", true), bassBar("C2", "G1", true)]);
const soloBass = fourBars([bassBar("E1", "B1", true), bassBar("G1", "D2", true), bassBar("D2", "A2", true), bassBar("C2", "G1", true)]);
const outroBass = fourBars([bassBar("E1", "B1"), bassBar("C2", "G1"), bassBar("D2", "A2"), bassBar("E1", "B1")]);

export const song_08: MDSong = {
  name: "Sol de Jah",
  gender: SONG_GENDERS.REGGAE,
  time: 4,
  bpm: 80,
  repeat: false,
  prompt: 'Utilizando os arquivos da pasta `src/ts/songs` como exemplo, quero que você crie um novo arquivo `song-XX.mts` que seja uma música no estilo REGGAE com baixo e bateria.\n\nFaça uma música completa de aproximadamente 4 minutos, com introdução, verso, variação, refrão e solo, na ordem que você desejar.\n\nPara saber os códigos das partes da bateria, leia o arquivo `README.md` (lembrando de nunca usar `G2`e `A#2`).\n\nAs notas de baixo são os arquivos na pasta `src/audio/bass`, onde os números representam a oitava e a letra `s` significa "sustenido". Caso você precise utilizar alguma nota "bemol", utilize o arquivo de som equivalente, por exemplo, se você precisa de um sol bemol, utilize a marcação do fá sustenido.\n\nNo novo arquivo criado, preencha a propriedade `prompt` do objeto `MDSong` com este prompt que você usou. Você deve usar EXATAMENTE este prompt que eu estou lhe passando, não a sua versão.\n\nNesta sessão, não altere a classe `MDPlayer` em absolutamente nada.',
  data: {
    tracks: [
      {
        instrument: INSTRUMENTS.DRUMS,
        mute: false,
        parts: [part(introDrums), part(verseDrums, 4), part(variationDrums, 2), part(chorusDrums, 4), part(verseDrums, 2), part(soloDrums, 3), part(chorusDrums, 3), part(outroDrums)],
      },
      {
        instrument: INSTRUMENTS.BASS,
        mute: false,
        parts: [part(introBass), part(verseBass, 4), part(variationBass, 2), part(chorusBass, 4), part(verseBass, 2), part(soloBass, 3), part(chorusBass, 3), part(outroBass)],
      },
    ],
  },
};
