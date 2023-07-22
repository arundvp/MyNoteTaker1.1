const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route for the landing page (home page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API route to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read data.' });
    }
    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse data.' });
    }
  });
});

// API route to create a new note
app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read data.' });
    }
    try {
      const notes = JSON.parse(data);
      const newNote = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text,
      };
      notes.push(newNote);
      fs.writeFile(path.join(__dirname, 'db' , 'db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to write data.' });
        }
        res.json(newNote);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse data.' });
    }
  });
});


// API route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteIdToDelete = req.params.id;

  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read data.' });
    }

    try {
      let notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteIdToDelete);

      fs.writeFile(path.join(__dirname,'db', 'db.json'), JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to write data.' });
        }
        res.json({ message: 'Note deleted successfully.' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse data.' });
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
