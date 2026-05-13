const router = require('express').Router();
const { jwtAuth } = require('../middlewares/jwtAuth');
const {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskControllers');

router.get('/', jwtAuth, getAllTasks);      // Get all tasks
router.post('/', jwtAuth, createTask);      // Create a new task
router.put('/:id', jwtAuth, updateTask);    // Update a task
router.delete('/:id', jwtAuth, deleteTask); // Delete a task

module.exports = router;