const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const cors       = require('cors');
const passport   = require('passport');
const mongoose   = require('mongoose');
const config     = require('./config/database');

// Connect to database
mongoose.connect(config.database);

mongoose.connection.on('error', (err) => {
  console.log('database error: ' + config.database);
})

const app = express();

// const users = require('./routes/users');

const port = 3000;
app.use(cors());

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// app.use('/users', users);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log('Server started on port' + port);
});