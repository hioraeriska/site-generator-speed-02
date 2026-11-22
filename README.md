# Site-generator-speed v2

A faster drop-in for makefun-site 1.0.0, written fresh for
`site-generator-speed-01-run-20261122`. `solve.js` exports `run(input)`,
which returns exactly the output tree makefun-site 1.0.0 builds for one
case's site; `main.ts` is the driver the harness runs.

## How it is faster

- **One fused Markdown pass.** Lexing and rendering walk the lines once,
  with no token array and no per-line regexes; block kinds are decided by
  the first characters of each line.
- **Batched escaping.** Inline text is flushed in whole runs, so HTML
  escaping is one call per run instead of one regex call per character.
- **No rescans.** Front matter is scanned in place and the body is a single
  slice; word counts are a char scan instead of a regex match; slugs, long
  dates and link resolutions are cached within a case (caches are rebuilt
  on every `run()`, so nothing carries from one case to the next).
- **Cheap templates.** Templates render into chunk arrays with one reused
  frame and loop record per `for`, instead of a fresh scope object and
  string per item.

## Layout

- `main.ts` — driver: reads `/input/cases.json`, answers each case with
  `run()`, writes `/output/answers.json`.
- `solve.js` — the whole drop-in: front matter, Markdown, templates, and
  the build pipeline.
- `LICENSE` — MIT.
