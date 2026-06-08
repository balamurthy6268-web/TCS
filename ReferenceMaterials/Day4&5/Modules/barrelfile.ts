//This is like a index file that re-exports selected members from other modules, allowing you to import them from a single location. In this example, we are re-exporting the add function and PI constant from the math module, as well as the default export log from the exportDefaultExample module. We are also re-exporting the MathResult type from the math module. This allows us to import these members directly from the barrelfile, simplifying our imports in other parts of our application.

export { add, PI } from "./math";
export { default as log } from "./exportDefaultExample";
export type { MathResult } from "./math";
