# Contributing

## Local workflow

1. Run `pnpm install`.
2. Start the playground with `pnpm dev`.
3. Start the docs site with `pnpm dev:docs`.
4. Before opening a PR, run `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm publint`.

## Release workflow

- Push to `main` to rebuild GitHub Pages.
- Push a semantic version tag like `v0.0.0` to trigger npm publishing.