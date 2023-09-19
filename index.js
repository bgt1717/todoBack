const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo'); // Import your TodoModel

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (provide your MongoDB URI)
mongoose.connect('mongodb+srv://brycetown10:ppp@l1.rwhr5il.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Handle GET requests to retrieve tasks
app.get('/get', async (req, res) => {
  try {
    // Find all tasks in the MongoDB collection using TodoModel
    const tasks = await TodoModel.find();

    res.json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'An error occurred while retrieving tasks' });
  }
});

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndUpdate({ _id: id }, { done: true })
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete({ _id: id }) // Removed unnecessary { done: true }
        .then(result => res.json(result))
        .catch(err => res.json(err));
});


// Handle POST requests to add tasks
app.post('/add', async (req, res) => {
  try {
    const taskData = {
      task: req.body.task,
    };

    // Create a new task using the TodoModel
    const newTask = new TodoModel(taskData);

    // Save the new task to the database
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'An error occurred while adding the task' });
  }
});



app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
