const express = require("express");
const cors = require("cors");
const consign = require("consign");
const bodyparser = require("body-parser");
const expressValidator = require("express-validator");
const referrerPolicy = require("referrer-policy");

module.exports = () => {
    const app = express();

    app.use(cors());
    app.use(bodyparser.urlencoded({extended: true}));
    app.use(bodyparser.json());
    app.use(expressValidator());
    app.use(referrerPolicy({ policy: "strict-origin" }));

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
        next();
    });

    consign().include("controllers").into(app);



    return app;
};