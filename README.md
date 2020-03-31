# Codea IT - men challenge

Node + Express + MongoDB challenge

## Requirements

### Node.js

Use [nvm](https://github.com/nvm-sh/nvm) to install node [lts/erbium (v12.16.1)](https://nodejs.org/en/download/) or greater.

```bash
nvm install lts/erbium
nvm use lts/erbium
```

### MongoDB

Download [MongoDB v4.0](https://docs.mongodb.com/manual/installation/) or greater.

### Linter

We use both [eslint](https://eslint.org/) and [prettier](https://prettier.io/).

Please review [VS Code](https://code.visualstudio.com/) plugins at [dev dependencies](package.json).

## Installation

Configure environment variables:

Create `.env` file on the project root.
Please verify required ones at [.env.example](.env.example).

Install npm packages:

```bash
npm install
```

Start server:

```bash
npm start
```

Start server watching for file changes and reloading automatically using [nodemon](https://github.com/remy/nodemon/):

```bash
npm run dev
```

Output:

```json
{ "message": "App listening on port 3000!", "level": "info" }
```

Please open [http://localhost:3000](http://localhost:3000) in your browser to start the challenge!

## License

[MIT](https://choosealicense.com/licenses/mit/)
