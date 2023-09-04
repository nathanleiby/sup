# Sup

Personal productivity app. (todos, time-tracking, etc)

Usable here:
https://nathanleiby.github.io/sup

Requires using an email address to initialize cloud data storage (via Dexie Cloud).

## Development

### Deps

Install `asdf` to manage node versions.

On Mac:

- `brew install asdf`
- `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`
- `asdf install`

Now you can install deps:

```
npm install
```

### Running Locally

```
npm run dev
```

### Deploying

Deploys to GH pages. The below does build + deploy.

```
npm run deploy
```
