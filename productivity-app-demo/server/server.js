// A simple backend server example (server/server.js)
const express = require('express');
const cors = require('cors');

// This is your mock data. In a real app, this would come from a database.
const assignments = [
    { id: 1, course: 'CS101', title: 'Algorithm Visualizer', dueDate: '2025-11-15' },
    { id: 2, course: 'HIST221', title: 'Civil War Essay', dueDate: '2025-11-20' },
];

const app = express();
app.use(cors());

// This creates the API endpoint your app is trying to reach.
app.get('/api/assignments/:id', (req, res) => {
    const assignment = assignments.find(a => a.id.toString() === req.params.id);
    if (assignment) {
        res.json(assignment);
    } else {
        res.status(404).send('Assignment not found');
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
