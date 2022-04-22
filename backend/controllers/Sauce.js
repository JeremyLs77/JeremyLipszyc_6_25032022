// Imports
const Sauce = require('../models/sauce');
const fs = require('fs');

// Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  // Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  // Voir une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

  // Voir toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

  // Gestion des likes/dislikes
exports.likeSauce = (req, res, next) => {
  if (req.body.like === 1) {  // Like
      Sauce.updateOne( {_id:req.params.id}, { 
        $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
        .then(() => res.status(200).json({ message: 'Like ajouté'}))
        .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) {  // Dislike
      Sauce.updateOne( {_id:req.params.id}, {
         $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
        .then(() => res.status(200).json({ message: 'Dislike ajouté'}))
        .catch(error => res.status(400).json({ error }));
  } else {  // Aucun avis
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne( {_id:req.params.id}, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
              .then(() => res.status(200).json({ message: 'Like supprimé'}))
              .catch(error => res.status(400).json({ error }))
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne( {_id:req.params.id}, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
              .then(() => res.status(200).json({ message: 'Dislike supprimé'}))
              .catch(error => res.status(400).json({ error }))
          }
        })
        .catch(error => res.status(400).json({ error }));
  }
};