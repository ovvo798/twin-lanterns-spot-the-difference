// The three rounds in order. Each scene paints both pictures and names its
// differences; difficulty rises by more differences, smaller targets and less time.
import { gardenScene } from './garden.js';
import { nightScene } from './night.js';
import { harborScene } from './harbor.js';

export const SCENES = [gardenScene, nightScene, harborScene];

/** Total differences across all three rounds. */
export function totalDifferences() {
  return SCENES.reduce((sum, scene) => sum + scene.diffs.length, 0);
}
