import { Index } from "./classes/Index.mjs";
import { MDPlayer } from "./classes/MDPlayer.mjs";
const player = new MDPlayer();
const index = new Index(player);
index.init();
