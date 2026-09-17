# MetaCall VS Code Extension

MetaCall extension integrates the MetaCall language server in VS Code to provide cross-language development features for polyglot projects. It auto-detects the host platform and architecture then download the suitable binary then starts MetaCall LSP over stdio as a native executable.

## Features

- Enables language server support for:
	- Python
	- JavaScript
	- TypeScript
	- C
	- C++
	- Rust
- Hovering tooltip with the symbol name and signature
- Completions suggestions
- Worksapce symbols
- Diagnostics

## Requirements

- VS Code `^1.131.0`
- Network access on first run (to fetch release metadata and binary)

## Development

Build once:

```bash
npm run compile
```

Watch mode:

```bash
npm run watch
```

## Licence

Apache-2.0. See `LICENSE`.
