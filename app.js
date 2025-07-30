const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path')
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', routes);

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


// Serve static assets from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html on unmatched routes (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use((req, res, next) => {
  console.log('🛑 No route matched:', req.method, req.originalUrl);
  res.status(404).send('Not Found');
});


module.exports = app;