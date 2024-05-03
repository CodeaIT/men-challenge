# Codea IT - M.E.N. challenge

Node + Express + MongoDB challenge

## Requirements

### Node.js

Use [nvm](https://github.com/nvm-sh/nvm) to install node [lts/hydrogen (v18.x)](https://nodejs.org/en/download/) or greater.

```bash
nvm use
nvm install lts/hydrogen
```

### MongoDB

Download [MongoDB v6.0](https://docs.mongodb.com/manual/installation/) or greater.

### Linter

We use both [eslint](https://eslint.org/) and [prettier](https://prettier.io/).

Please review [VS Code](https://code.visualstudio.com/) plugins at [dev dependencies](package.json).

---

## Installation

Create the following files on the `project root`:

- `.env` for development
- `.env.test` for unit testing purposes

Please verify the required environment variables at [.env.example](.env.example).

Install npm packages:

```bash
npm install
```

---

## Running

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

---

## Tests

Running test suite with [mocha](https://mochajs.org/):

```bash
npm run test
```

---

## API docs

After running tests, the OAS (open API specification) file must be generated as `api_docs.json`:

Restart your server and see swagger-ui docs at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

# Challenge

First steps:

- `Fork` this GitHub repository.
- Allow public access to review after shipping.
- Open [http://localhost:3000](http://localhost:3000) in your browser to start!

---

## License

[MIT](https://choosealicense.com/licenses/mit/)
