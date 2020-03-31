# Codea IT - men challenge

Node + Express + MongoDB challenge

## Requirements

### Node.js

Use [nvm](https://github.com/nvm-sh/nvm) to install node [lts/erbium (v12.16.1)](https://nodejs.org/en/download/) or greater.

```bash
nvm install lts/erbium
nvm use lts/erbium
```

### Linter

We use both [eslint](https://eslint.org/) and [prettier](https://prettier.io/).

Please review [VS Code](https://code.visualstudio.com/) plugins at [dev dependencies](package.json).

## Installation

Install npm packages:

```bash
npm install
```

Start server:

```bash
npm start
```

Start server watching for file changes and reloading automatically using [nodemon](https://github.com/remy/nodemon/).

```bash
npm run dev
```

Output:

```json
{ "message": "App listening on port 3000!", "level": "info" }
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
