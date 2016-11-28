const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./config/webpack.dev');
const bodyParser = require('body-parser');

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
const jsonfile = require('jsonfile');
const m_nulecules = require('./mocks/nulecules');
const m_nulecule_detail = require('./mocks/nulecule_detail');
const m_answer_file = path.join(__dirname, "mocks","submitted_data", "answers.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/nulecules', (req, res) => {
  res.json(m_nulecules);
});

app.get('/nulecules/:registry/:nuleculeId', (req, res) => {
  console.log(`nulecule detail ${req.params.nuleculeId}`);
  res.json(m_nulecule_detail);
});

app.post('/nulecules/:registry/:nuleculeId', (req, res) => {
  console.log('got response -> ', req.body);
  jsonfile.writeFileSync(m_answer_file, req.body);
  res.json({
    nulecule: {
      general: {
        namespace: 'cap-b3e8902f-2f3c-4f12-861c-54e3c2ecd54e'
      }
    }
  });
});

app.post('/nulecules/:registry/:nuleculeId/deploy', (req, res) => {
  setTimeout(() => {
    res.json({result: 'success'});
  }, 5000);
});
