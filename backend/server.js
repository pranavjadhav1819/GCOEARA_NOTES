require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const metaRoutes = require('./routes/metaRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();   // ← app must be defined FIRST

app.use(                 // ← THEN use helmet AFTER app is defined
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://www.gstatic.com", "https://lh3.googleusercontent.com"],
        connectSrc: ["'self'", "https://*.supabase.co", "https://accounts.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameSrc: ["'self'", "https://accounts.google.com"],
      }
    }
  })
);