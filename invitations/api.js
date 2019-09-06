'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model-datastore');

const router = express.Router();

// parse application/json
router.use(bodyParser.json());
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/telefono/:telefono', (req, res) => {
    model.filter('telefono', req.params.telefono, (err, entities) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entities);
    });
});

router.get('/:invitation', (req, res, next) => {
    model.read(req.params.invitation, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entity);
    });
});



router.post('/', (req, res, next) => {
    const data = req.body;
    model.create(data, (err, savedData) => {
        if (err) {
            next(err);
            return;
        }
        res.redirect(`${savedData.id}`);
    });
});

module.exports = router;