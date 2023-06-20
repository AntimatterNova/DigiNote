const express = require('express');
const path = require('path');
const fs = require('fs');
const api = require('./public/assets/js/index.js');
const uuid = require('./helpers/uuid');
const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());

// Loading notes from db.json
app.get('/api/notes', (req, res) => {
  const note = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "db.json")));
  res.json(note);
});

// HTML routes
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    // Read the existing notes from the JSON file
    const existingNotes = JSON.parse(fs.readFileSync(dbFilePath));

    // Add the new note to the existing notes array
    existingNotes.push(newNote);

    // Write the updated notes array back to the JSON file
    fs.writeFileSync(dbFilePath, JSON.stringify(existingNotes));

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});