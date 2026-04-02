const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON request bodies
app.use(express.json());

// Root endpoint just in case the user visits / in the browser
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Student API! Visit /students to view all records.' });
});

// In-memory data store
let students = [
  { id: '1', name: 'John Doe', branch: 'Computer Engineering', year: 'SE' },
  { id: '2', name: 'Jane Smith', branch: 'Information Technology', year: 'TE' }
];

// GET /students → Get all students
app.get('/students', (req, res) => {
  res.json(students);
});

// GET /students/:id → Get a specific student
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
});

// POST /students → Add a new student
app.post('/students', (req, res) => {
  const { id, name, branch, year } = req.body;
  
  if (!id || !name || !branch || !year) {
    return res.status(400).json({ message: 'Missing required fields: id, name, branch, year' });
  }
  
  if (students.find(s => s.id === id)) {
    return res.status(409).json({ message: 'Student with this ID already exists' });
  }

  const newStudent = { id, name, branch, year };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PATCH /students/:id → Update student details
app.patch('/students/:id', (req, res) => {
  const { name, branch, year } = req.body;
  const studentIndex = students.findIndex(s => s.id === req.params.id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Update provided fields dynamically
  if (name !== undefined) students[studentIndex].name = name;
  if (branch !== undefined) students[studentIndex].branch = branch;
  if (year !== undefined) students[studentIndex].year = year;

  res.json(students[studentIndex]);
});

// DELETE /students/:id → Delete a student
app.delete('/students/:id', (req, res) => {
  const studentIndex = students.findIndex(s => s.id === req.params.id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];
  res.json({ message: 'Student successfully deleted', deletedStudent });
});

app.listen(PORT, () => {
  console.log(`Student Record API running on http://localhost:${PORT}`);
});
