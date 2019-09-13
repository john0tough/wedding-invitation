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

router.get('/capturado/:invitation', (req, res, next) => {
    model.read(req.params.invitation, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        let titulo = '';
        if (entity.activo === 'true') {
            titulo = 'Informacion capturada: <br>';
        } else {
            titulo = 'Informacion eliminada: <br>';
        }
        res.status(200)
            .send(`
            <a href="/api/invitations/">Ir a lista de Invitados</a> <br><br>
            ${titulo}
            <b>Nombre</b>: ${entity.nombre} <br>
            <b>Apellidos</b>: ${entity.apellidos} <br>
            <b>Es una Familia</b>: ${entity.esFamilia} <br>
            <b>Telefono</b>: ${entity.telefono} <br>
            <b>Numero de invitados</b>: ${entity.invitados} <br>
            <b>Activo</b>: ${entity.activo} <br>
            
        `);
    });
});

router.get('/del/:invitation', (req, res, next) => {
    model.read(req.params.invitation, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        entity.activo = false;
        model.update(req.params.invitation, entity, (err, savedData) => {
            if (err) {
                next(err);
                return;
            }
            res.redirect(`/api/invitations/capturado/${savedData.id}`);
        })
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

router.get('/', (req, res, next) => {
    model.list(10, req.query.pageToken, (err, entities, cursor) => {
        if (err) {
            next(err);
            return;
        }
        let rows = '';
        entities.forEach(element => {
            rows = rows + `
            <tr>
                <td>${element.nombre}</td>
                <td>${element.apellidos}</td>
                <td>${element.invitados}</td>
                <td>${element.telefono}</td>
                <td>${element.esFamilia}</td>
                <td>${element.confirmado}</td>
                <td><a href="del/${element.id}">Eliminar</a></td>
            <tr>
            `;
        });
        res.status(200).send(`
        <h2>Lista de Invitados</h2>
        <a href="/invitaciones.html">Agregar Invitado</a>
        <table>
        <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Num. invitados</th>
            <th>Teleono</th>
            <th>Es familia</th>
            <th>Confirmado</th>
            <th>Eliminar?</th>
        <tr>
            ${rows}
        </table>
        `);
    });
});

router.post('/', (req, res, next) => {
    const data = req.body;
    if (Array.isArray(data.esFamilia)) {
        data.esFamilia = true;
    }
    model.create(data, (err, savedData) => {
        if (err) {
            next(err);
            return;
        }
        res.redirect(`/api/invitations/capturado/${savedData.id}`);
    });
});
router.put('/', (req, res, next) => {
    const data = req.body;
    model.read(data.id, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        entity.confirmado = data.confirmado;
        model.update(data.id, entity, (err, savedData) => {
            if (err) {
                next(err);
                return;
            }
            res.json(savedData);
        })
    });
});

module.exports = router;