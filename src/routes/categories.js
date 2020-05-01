const express = require('express');
const router = express.Router();

const {
    fetchCategories,
    addCategory,
    reorderCategories,
    deleteCategory,
    updateCategory
} = require("../services/categories.js");
const isAuthenticated = require('../middlewares');

router.use(isAuthenticated);

router.get('/', (req, res) => {
    const { user } = req.query;
    fetchCategories(user)
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err))

})

router.post('/', (req, res) => {
    const { user, name } = req.body;
    addCategory(user, name)
        .then((id) => res.status(201).send(id))
        .catch(err => res.status(500).send(err))
});

router.put('/reorder', (req, res) => {
    const { user, categories } = req.body;
    reorderCategories(user, categories)
        .then(() => res.status(200).send("Reordered"))
        .catch(err => res.status(500).send(err))
})

router.delete('/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    deleteCategory(categoryId)
        .then(() => res.status(200).send('Deleted successfully'))
        .catch(err => res.status(500).send(err))
});

router.put('/', (req, res) => {
    const { category } = req.body;
    updateCategory(category)
        .then(() => res.status(200).send("Category updated"))
        .catch(err => res.status(500).send(err))
})

module.exports = router;
