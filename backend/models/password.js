// Import
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

// Paramétrage des conditions de mot de passe
passwordSchema
    .is().min(8) //Minimum 8 caractères
    .is().max(15) //Maximum 15 caractères
    .has().uppercase() //Doit contenir au moins 1 caractère majuscule
    .has().lowercase() //Doit contenir au moins 1 caractère minuscule
    .has().digits(2) //Doit contenir au moins 2 chiffres
    .has().not().spaces() //Ne doit pas contenir d'espaces
    .is().not().oneOf(['Passw0rd','Password123']) //Valeurs refusées

// Export
module.exports = passwordSchema;