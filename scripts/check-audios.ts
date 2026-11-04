import { bass } from "./tmp/bass.mts";
import { drums } from "./tmp/drums.mts";
import { guitarClean } from "./tmp/guitar-clean.mts";

const ORDER: Record<string, number> = {
  Ab: 14,
  A: 15,
  As: 16,
  Bb: 17,
  B: 18,
  C: 1,
  Cs: 2,
  Db: 3,
  D: 4,
  Ds: 5,
  Eb: 6,
  E: 7,
  Fb: 8,
  F: 9,
  Fs: 10,
  Gb: 11,
  G: 12,
  Gs: 13,
};

function main() {
  bass.sort(sorter);
  drums.sort(sorter);
  guitarClean.sort(sorter);

  console.log("bass\n");
  bass.forEach(showValue);
  console.log("\n");

  console.log("drums\n");
  drums.forEach(showValue);
  console.log("\n");

  console.log("guitar-clean\n");
  guitarClean.forEach(showValue);
}

function sorter(noteA: string, noteB: string): number {
  let multiplierA = 1;
  let multiplierB = 1;
  if (noteA[noteA.length - 2] == "-") {
    multiplierA = -1;
  }
  if (noteB[noteB.length - 2] == "-") {
    multiplierB = -1;
  }
  const octaveA = Number(noteA[noteA.length - 1]) * multiplierA;
  const octaveB = Number(noteB[noteB.length - 1]) * multiplierB;
  const diff = octaveA - octaveB;
  if (diff == 0) {
    const pitchA = noteA[0] + (noteA[1] == "s" ? "s" : "");
    const pitchB = noteB[0] + (noteB[1] == "s" ? "s" : "");
    return Number(ORDER[pitchA]) - Number(ORDER[pitchB]);
  } else {
    return diff;
  }
}

function showValue(value: string) {
  console.log(`"${value}", `);
}

main();

/*
bass

E1
F1
Fs1
G1
Gs1
A1
As1
B1

C2
Cs2
D2
Ds2
E2
F2
Fs2
G2
Gs2
A2
As2
B2

C3
Cs3
D3
Ds3
E3
F3
Fs3
G3


drums

B0

C1
Cs1
D1
Ds1
E1
F1
Fs1
G1
Gs1
A1
As1
B1

C2
Cs2
D2
Ds2
E2
F2
Fs2
G2
Gs2
A2
As2
B2


guitar-clean

E-1
F-1
Fs-1
G-1
Gs-1
A-1
As-1
B-1

C0
Cs0
D0
Ds0
E0
F0
Fs0
G0
Gs0
A0
As0
B0

C1
Cs1
D1
Ds1
E1
F1
Fs1
G1
Gs1
A1
As1
B1

C2
Cs2
D2
Ds2
E2
F2
Fs2
G2
Gs2
A2
As2
B2

C3
Cs3
D3
Ds3
E3
F3
Fs3
G3
Gs3
A3
As3
B3

C4
Cs4
- D4
- Ds4
E4
F4
Fs4
G4
Gs4
A4
As4
B4

C5
Cs5
D5
Ds5
E5

*/
