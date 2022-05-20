const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(readNotes());
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now();
  const notes = readNotes();
  notes.push(newNote);
  writeNotes(notes);
  res.send();
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  let notes = readNotes();
  notes = notes.filter(note => note.id !== id);
  writeNotes(notes);
  res.send();
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

function readNotes() {
  const  notes = fs.readFileSync("./db/db.json");
  return JSON.parse(notes);
}

function writeNotes(notes) {
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
}

