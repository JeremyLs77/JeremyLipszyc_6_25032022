// Imports
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require('path');
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieSession = require('cookie-session')
const sauceRoutes = require('./routes/sauce');
const userRoutes = require("./routes/user");
const rateLimit = require('express-rate-limit');

dotenv.config();

// Parametrage de la connexion a MongoDB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Parametrage des headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// Gestion des objets JSON
app.use(express.json());

// Gestion des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Gestion des cookies
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Paramétrage de rateLimit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // limite de 100 requetes pour la durée window spécifiée
});

app.use(limiter);

// Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Sécurisation des headers HTTP
app.use(helmet());

// Exports
module.exports = app;
