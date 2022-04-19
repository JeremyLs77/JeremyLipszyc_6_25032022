// Imports
const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const sauceRoutes = require('./routes/sauce');
const userRoutes = require("./routes/user");

// Parametrage de la connexion a MongoDB
mongoose
  .connect("mongodb+srv://jldev:Tcv3TPz3TKdgw2Es@cluster0.z07yk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
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

// Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Exports
module.exports = app;
