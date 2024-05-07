"use strict"

const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const db = new DB("sqlitedb")
const app = express();
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const enableCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
app.use(enableCrossDomain)

router.post('/register', function (req, res) {
    db.insert([
        req.body.username,
        bcrypt.hashSync(req.body.password, 8)
    ],
        function (err) {
            if (err) return res.status(500).send("There was a problem registering the user.")
            db.selectByUser(req.body.username, (err, user) => {
                if (err) return res.status(500).send("There was a problem getting user")
                let token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({ auth: true, token: token, user: user });
            });
        });
});

router.post('/login', (req, res) => {
    db.selectByUsername(req.body.username, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400
        });
        res.status(200).send({ auth: true, token: token, user: user });
    });
})

app.use(router);
let port = process.env.PORT || 3000;
let server = app.listen(port, function () {
    console.log('Server listening on port' + port)
});
