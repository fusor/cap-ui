const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./config/webpack.dev');

const app = express();
const compiler = webpack(config);
const port = process.env.PORT || 3000;

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.listen(port, '0.0.0.0', err => {
  if(err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://0.0.0.0:${port}`);
});


////////////////////////////////////////////////////////////
// MOCKS
////////////////////////////////////////////////////////////
const m_nulecules = require('./mocks/nulecules');
const m_nulecule_detail = require('./mocks/nulecule_detail');

app.get('/nulecules', (req, res) => {
  console.log('nulecules hit');
  res.json(m_nulecules);
});

app.get('/nulecules/:nuleculeId', (req, res) => {
  console.log(`nulecule detail ${req.params.nuleculeId}`);
  res.json(m_nulecule_detail);
});
