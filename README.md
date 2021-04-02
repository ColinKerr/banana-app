# The Banana App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the iTwin template `npx create-react-app your-app-name --template @bentley/itwin-viewer --scripts-version @bentley/react-scripts`

## Environment Variables

Prior to running the app, add a valid contextId and iModelId for your user in the .env file:

```
# ---- Test ids ----
IMJS_CONTEXT_ID = ""
IMJS_IMODEL_ID = ""
```

You can also replace the OIDC client data in this file with your own if you'd prefer.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
