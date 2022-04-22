// Imports
const express = require('express');
const router = express.Router();
const checkPassword = require('../middleware/password-validator');
const userCtrl = require('../controllers/user');

// Routes
router.post('/signup', checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

// Exports
module.exports = router;
