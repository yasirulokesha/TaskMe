const Task = require('../models/taskSchema');

// View all tasks
exports.getAllTasks = async (req, res) => {
    await Task.find()
        .then(tasks => res.json(tasks))
        .catch(err => res.status(500).json({ error: 'Failed to fetch tasks | Server Error' }));
}

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;
    const newTask = new Task({
        username: `${req.user.username}`,
        title,
        description,
        dueDate: new Date(dueDate),
        completed: false
    });

    await newTask.save()
        .then(() => {
            console.log('Task created successfully');
            res.status(201).json(newTask);
        })
        .catch(err => {
            console.error('Error creating task:', err);
            res.status(500).json({ error: 'Failed to create task | Server Error' });
        })
}

// Update a task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;

    Task.findByIdAndUpdate(id, {
        title,
        description,
        dueDate: new Date(dueDate),
        completed
    }, { new: true })
    .then(updatedTask => res.json(updatedTask))
    .catch(err => res.status(500).json({ error: 'Failed to update task' }));
}

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    Task.findByIdAndDelete(id)
        .then(() => res.json({ message: 'Task deleted successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to delete task' }));
}