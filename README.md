# Ribbon Frontend

This repo hosts the source code that runs 3 of Ribbon Finance's webapps, the landing page, the v1 webapp, and the Strangles webapp.

## Getting Started

To begin, install the node dependencies:

```
yarn install
```

The frontend repo is a monorepo. Each package in the monorepo is a [Yarn workspace](https://classic.yarnpkg.com/en/docs/workspaces/). Structuring the repo as a monorepo allows us to share components across multiple webapps.

## Packages

- `shared`: holds all constants, common React components.
- `landing`: holds the Ribbon landing page.
- `webapp`: holds the v1 Ribbon webapp.
- `mvp`: holds the deprecated Strangles webapp.

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
