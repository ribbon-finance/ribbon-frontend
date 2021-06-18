# Ribbon Frontend

This repo hosts the source code that runs 3 of Ribbon Finance's webapps, the landing page, the v1 webapp, and the Strangles webapp.

## Getting Started

To begin, install the node dependencies:

```
yarn install
```

The frontend repo is a monorepo. Each package in the monorepo is a [Yarn workspace](https://classic.yarnpkg.com/en/docs/workspaces/). Structuring the repo as a monorepo allows us to share components across multiple webapps.

### Setting up your environment

The webapp uses environment variables to talk to the blockchain. Copy paste these variables and create a new file `webapp/.env`.

You will need to have access to a node to fill up `REACT_APP_MAINNET_URI` and `REACT_APP_TESTNET_URI`, we recommend either [Infura](https://infura.io/) or [Alchemy](https://www.alchemyapi.io/).

```
REACT_APP_VERCEL_GIT_COMMIT_REF=staging # used to track which branch is used to deploy the app. 'staging' uses kovan for URLs
REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID=your_analytics_id
# INFURA URI is also your MAINNET_URI
REACT_APP_MAINNET_URI=your_mainet_uri # Default to homestead if does not exists
REACT_APP_TESTNET_URI=your_testnet_uri
REACT_APP_SUBGRAPHQL_URL=https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance
REACT_APP_KOVAN_SUBGRAPHQL_URL=https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance-kovan
REACT_APP_AIRTABLE_API_KEY=airtable_api_key
REACT_APP_AIRTABLE_BASE_ID=airtable_base_id
```

In order to switch between the development environment and a production environment, we can change the `REACT_APP_VERCEL_GIT_COMMIT_REF` env var.

```
REACT_APP_VERCEL_GIT_COMMIT_REF=staging # used to see mainnet data

REACT_APP_VERCEL_GIT_COMMIT_REF=development # used to see testnet (kovan) data
```

### Running the webapp

To run the webapp, you need to open two terminals, one in `shared` and another in `webapp`. We
start with running `yarn start` in `shared`.

```
cd shared/
yarn start
```

Now, in the webapp directory, we can start the build server.

```
cd webapp/
yarn start
```

The webapp should automatically open at http://localhost:3000. Happy building! 🛠👷‍♀️👷‍♂️

## Packages

- `shared`: holds all constants, common React components.
- `landing`: holds the Ribbon landing page.
- `webapp`: holds the v1 Ribbon webapp.

## Available Scripts

In the individual package directories, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Contributing

Feel free to open issues and PRs that help improve Ribbon's frontend. Ribbon's frontend uses the React + Typescript + hooks stack, so experience using these technologies is highly appreciated when making pull requests.

## License

The primary license for ribbon-frontend is the Business Source License 1.1 (BUSL-1.1), see LICENSE.
