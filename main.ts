// Site-generator-speed v2 driver: the harness runs `node main.ts`, which
// reads every case from the input directory, answers each one alone with
// run() from solve.js, and writes the answers in order to answers.json in
// the output directory. Outside a container MAKEFUN_INPUT_DIR and
// MAKEFUN_OUTPUT_DIR stand in for /input and /output. V8's incremental
// marking is off before solve.js is imported, as the house baseline runs.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setFlagsFromString } from 'node:v8';

setFlagsFromString('--no-incremental-marking');

const solver = await import(new URL('./solve.js', import.meta.url).href);
const run = solver.run as (input: unknown) => unknown;

const inputDir = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const raw = readFileSync(join(inputDir, 'cases.json'), 'utf8');
const cases = JSON.parse(raw) as { id: string; input: unknown }[];

const answers: unknown[] = new Array(cases.length);
for (let k = 0; k < cases.length; k++) answers[k] = run(cases[k].input);

writeFileSync(join(outputDir, 'answers.json'), JSON.stringify(answers));
