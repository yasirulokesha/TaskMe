const Task = require('../models/taskSchema');

// View all tasks
exports.getAllTasks = async (req, res) => {
    await Task.find({ username: `${req.user.username}` })
        .sort({ dueDate: 1 }) 
        .then(tasks => res.json(tasks))
        .catch(err => res.status(500).json({ error: 'Failed to fetch tasks | Server Error' }));
}

// Create a new task
exports.createTask = async (req, res) => {
    const { title, notes, dueDate } = req.body;
    const newTask = new Task({
        username: `${req.user.username}`,
        title,
        notes,
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
            console.error('Request body:', req.body);
            res.status(500).json({ error: 'Failed to create task | Server Error' });
        })
}

// Update a task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, notes, dueDate, completed } = req.body;

    await Task.findByIdAndUpdate(id, {
        title,
        notes,
        dueDate: new Date(dueDate),
        completed
    })
    .then(updatedTask => res.json(updatedTask))
    .catch(err => res.status(500).json({ error: 'Failed to update task' }));
}

// exports.updateTask = async (req, res) => {
//     const { id } = req.params;
//     const { completed } = req.body;
//     await Task.findByIdAndUpdate(id, { completed })
//         .then(updatedTask => res.json(updatedTask))
//         .catch(err => res.status(500).json({ error: 'Failed to update task' }));
// }

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    Task.findByIdAndDelete(id)
        .then(() => res.json({ message: 'Task deleted successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to delete task' }));
}