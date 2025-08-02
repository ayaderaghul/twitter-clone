const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json()); // For JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // For form data

// Routes
app.use('/api', routes);

// Security policy (optional)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", 'https://kit.fontawesome.com'],
      'script-src-elem': ["'self'", 'https://kit.fontawesome.com'],
      'connect-src': ["'self'", 'https://ka-f.fontawesome.com'],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://res.cloudinary.com',       // Cloudinary base domain
        'https://*.cloudinary.com',         // All Cloudinary subdomains
        'https://*.twemoji.maxcdn.com'      // For emoji support if needed
      ],
      'media-src': [                        // If you're using Cloudinary for videos
        "'self'",
        'data:',
        'blob:',
        'https://res.cloudinary.com',
        'https://*.cloudinary.com'
      ]
    }
  })
);

// Static files
app.use(express.static('dist'));

// 404 handler
app.use((req, res) => {
  console.log('🛑 No route matched:', req.method, req.originalUrl);
  res.status(404).send('Not Found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
