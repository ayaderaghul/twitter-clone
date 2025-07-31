const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// const path = require('path')
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', routes);


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': [
        "'self'",
        'https://kit.fontawesome.com',
        // Add other allowed script sources here
      ],
      'script-src-elem': [
        "'self'",
        'https://kit.fontawesome.com',
        // Add other allowed script sources here
      ],
      'connect-src': [
        "'self'",
        'https://ka-f.fontawesome.com',
        // Add other allowed connect sources here
      ]
    }
  })
);


// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


// Serve static assets from the dist folder
// app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static('dist'))
// Serve index.html on unmatched routes (for client-side routing)
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });


app.use((req, res, next) => {
  console.log('🛑 No route matched:', req.method, req.originalUrl);
  res.status(404).send('Not Found');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;