# CAP React Project

React based front-end for the CAP project, designed to run inside [cap-vm](http://github.com/fusor/cap)
for development purposes.

### Dependencies

node & npm (tested in 6.5.0)

### Development Server

`npm install` to install required node packages.

Uses an express based webpack development server, includes [HMR](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html).

`npm start` launches the development server, bundle is output to `build`

Served at `http://localhost:3000`.

API is configured in `src/shared/api.js`; configured to talk to `http://cap.example.com:3001`
