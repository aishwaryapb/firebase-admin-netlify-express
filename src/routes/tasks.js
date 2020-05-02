const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares');
const { fetchCategories } = require('../services/categories');
const {
    fetchTasks,
    reorderTasks,
    deleteTask,
    addTask,
    updateTask
} = require('../services/tasks');

router.use(isAuthenticated);

router.get('/', (req, res) => {
    const { user } = req.query;
    fetchCategories(user)
        .then((categories) => fetchTasks(user, categories))
        .then((tasks) => res.json(tasks))
        .catch(err => res.status(500).send(err))
})

router.put('/reorder', (req, res) => {
    const { tasks, categoryId, user } = req.body;
    reorderTasks(user, tasks, categoryId)
        .then(() => res.status(200).send("Reordered tasks successfully"))
        .catch(err => res.status(500).send(err))
})

router.delete('/:taskId', (req, res) => {
    const { taskId } = req.params;
    deleteTask(taskId)
        .then(() => res.status(200).send("Task deleted successfully"))
        .catch((err) => res.status(500).send(err))
})

router.post('/', (req, res) => {
    const { name, user, categoryId } = req.body;
    addTask(name, user, categoryId)
        .then((task) => res.status(201).json(task))
        .catch(err => res.status(500).send(err))
})

router.put('/', (req, res) => {
    const { task } = req.body;
    updateTask(task)
        .then(() => res.status(200).send("Task updated successfully"))
        .catch(err => res.status(500).send(err));
})

module.exports = router;