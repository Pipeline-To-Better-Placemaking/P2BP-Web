const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const colDBfoos = require('../databaseFunctions/CollectionFunctions.js');

router.get('/access/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "access");
    res.status(200).json(collection);
});

router.get('/boundaries/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "boundaries");
    res.status(200).json(collection);
});

router.get('/light/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "light");
    res.status(200).json(collection);
});

router.get('/moving/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "moving");
    res.status(200).json(collection);
});

router.get('/nature/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "nature");
    res.status(200).json(collection);
});

router.get('/order/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "order");
    res.status(200).json(collection);
});

router.get('/program/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "program");
    res.status(200).json(collection);
});

router.get('/section/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "section");
    res.status(200).json(collection);
});

router.get('/sound/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "sound");
    res.status(200).json(collection);
});

router.get('/stationary/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "stationary");
    res.status(200).json(collection);
})

router.get('/survey/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const collection = await colDBfoos.getCollection(req.params.id, "survey");
    res.status(200).json(collection);
});

module.exports = router
