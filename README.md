# Tactics Battle Game

A game inspired by Final Fantasy Tactics and Megaman Battle Network. Built with [three.js](https://threejs.org/) using [TypeScript](https://www.typescriptlang.org/).

## Requirements

The following is either required or highly recommended to contibute to this project.

### Engine

This is a [node](https://nodejs.org/en) project and built on the [npm](https://www.npmjs.com/) ecosystem. You will need to have `node` and `npm` installed to contribute to this project.

If you are using linux or macOS, consider using [n](https://www.npmjs.com/package/n) to install and manage `node`/`npm` versions. If you are using Windows, consider using [nvm-windows](https://github.com/coreybutler/nvm-windows).

### Package Manaagement / Script Running

This project uses [pnpm](https://pnpm.io/) for package management and script running. To install `pnpm` follow the [installation instructions from their site](https://pnpm.io/installation).

### IDE

This project is built assuming you are using [VSCode](https://code.visualstudio.com/), but any text editor will work. The game runs in the browser, you can use the browser of your choice.

If you use VSCode, the recommended plugins are included in the workspace config in `.vscode/extensions.json`.

## Available Commands

This project uses `pnpm` as a script runner for various development tasks. Below is a breakdown of the various commands available to you.

### Setup

Before you can run the game, install all of the necessary dependencies with:

```bash
pnpm i
```

### Running the Game

To run the game, first start the development server with:

```bash
pnpm run dev
```

This will start the `vite` development server and open the game in your browser window. From here, any of your changes should be automatically picked up and refreshed.

### Running the Level Editor

To run the game, first start the development server with:

```bash
pnpm run level-editor
```

This will start the `vite` development server and open the game in your browser window. From here, any of your changes should be automatically picked up and refreshed.

### Building the Game

To build the game into its production assets, run:

```bash
pnpm run build
```

This will generate the build artifacts and place them in the `dist` directory. _The `dist` directory should never be committed to the git repository_.

## Architecture

This project is a monorepo built on `pnpm` [workspaces](https://pnpm.io/workspaces). The following is a breakdown of the application architecture:

- `.vscode`: VSCode IDE configuration
- `game`: The rendering and game logic
- `server`: The application logic
- `tools`: A collection of tools and shared code
  - `api`: API definitions for shared `game` logic and  `game <-> server` communication
  - `level-editor`: A tool for creating battle maps
  - `three-utils`: Common utilities for `three`
  - `ui`: UI elements
