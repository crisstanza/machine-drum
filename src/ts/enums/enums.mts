export const HTML = Object.freeze({
  CLASS_NAMES: Object.freeze({
    ACTIVE: "active",
    CLICKABLE: "clickable",
    ITALIC: "italic",
    LOADING: "loading",
    MUTED: "muted",
    VOLUME: "volume",
  }),
  ATTRIBUTE_NAMES: Object.freeze({
    DISABLED: "disabled",
    MIN: "min",
    MAX: "max",
    STEP: "step",
    TITLE: "title",
    TYPE: "type",
    VALUE: "value",
  }),
  ATTRIBUTE_VALUES: Object.freeze({
    MASTER_VOLUME: (value: string) => `master volume: ${value}`,
    MUTE: "mute",
    PAUSE: "pause",
    RANGE: "range",
    UNMUTE: "unmute",
    UNPAUSE: "unpause",
    VOLUME: (value: string) => `volume: ${value}`,
  }),
});

export const SONG_GENDERS = Object.freeze({
  _: "no gender",
  BALLAD: "ballad",
  BLUES: "blues",
  BOSSA_NOVA: "bossa nova",
  DISCO: "disco",
  HEAVY_METAL: "heavy metal",
  POP_ROCK: "pop/rock",
  PUNK: "punk",
  REGGAE: "reggae",
  ROCK: "rock",
});

export const SONG_KEYS = Object.freeze({
  _: "no key",
  C: "C",
  Cs: "C#",
  Db: "Db",
  D: "D",
  Ds: "D#",
  Eb: "Eb",
  E: "E",
  F: "F",
  Fs: "F#",
  Gb: "Gb",
  G: "G",
  Gs: "G#",
  Ab: "Ab",
  A: "A",
  As: "A#",
  Bb: "Bb",
  B: "B",
});

export const SONG_NAMES = Object.freeze({
  _: "no name",
});

export const INSTRUMENTS = Object.freeze({
  BASS: "bass",
  DRUMS: "drums",
  GUITAR_CLEAN: "guitar-clean",
  PIANO: "piano",
});
