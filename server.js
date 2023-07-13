const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const dbPath = path.join(__dirname, 'db', 'db.json');

app.use(express.static('public'));
app.use(express.json());

// Loading notes from db.json
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbPath));
  res.json(notes);
});

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  
  const { title, text } = req.body;
  
  
  if (title && text) {
   
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    
    const response = {
      status: 'success',
      body: newNote,
    };
    
    
    const existingNotes = JSON.parse(fs.readFileSync(dbPath));
    existingNotes.push(newNote);
    
    
    fs.writeFileSync(dbPath, JSON.stringify(existingNotes));
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  try {
    const curNotes = JSON.parse(fs.readFileSync(dbPath));
    const filtered = curNotes.filter(note => note.id != req.params.id);
  
    const response = {
      status: 'success',
      body: 'Note deleted',
    };
  
    fs.writeFileSync(dbPath, JSON.stringify(filtered));
    res.status(201).json(response);
  }
  catch(err) {
    res.status(500).json('Error in deleting the note');
  }
  
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`App listening on ${process.env.PORT || PORT}`);
});