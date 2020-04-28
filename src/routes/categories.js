const express = require('express');
const router = express.Router();
const { fetchCategories } = require("../services/categories.js");
const isAuthenticated = require("../middlewares/index");

router.get('/', isAuthenticated, (req, res) => {
    fetchCategories() //send user here from req param
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(500).send(err))

})

module.exports = router;
