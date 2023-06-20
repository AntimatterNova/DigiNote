const express = require('express');
const path = require('path');
const fs = require('fs');
const api = require('./public/assets/js/index');
const uuid = require('./helpers/uuid');
const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());

//loading notes from db.json
app.get('/api/notes', (req, res) => {
  const note = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "db.json")));
  res.json(note);
});
  
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
  
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

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

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});