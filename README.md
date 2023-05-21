# Sup

Personal productivity app. (todos, time-tracking, etc)

Usable here:
https://nathanleiby.github.io/sup

Requires using an email address to initialize cloud data storage (via Dexie Cloud).

## Development

### Running Locally

Because of `dexie-react-hooks`, need to install deps via:

```
npm i --legacy-peer-deps
```

Then can run app locally via:

```
npm run dev
```

### Deploying

Deploys to GH pages. The below does build + deploy.

```
npm run deploy
```
