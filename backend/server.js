const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 4000;

//Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (RAM only)
let versions = [];      // stores all version objects
let lastContent = "";   // last full content string

//Compute difference between old and new text
function computeDiff(oldText, newText) {
  const normalize = (text) =>
    text
      .replace(/\s+/g, " ") // collapse multiple spaces/newlines
      .trim();

  const oldNorm = normalize(oldText || "");
  const newNorm = normalize(newText || "");

  const oldWords = oldNorm ? oldNorm.split(" ") : [];
  const newWords = newNorm ? newNorm.split(" ") : [];

  const oldLength = oldWords.length;
  const newLength = newWords.length;

  const oldSet = new Set(oldWords);
  const newSet = new Set(newWords);

  // words present in new but not in old
  const addedWords = newWords.filter((w) => !oldSet.has(w));
  // words present in old but not in new
  const removedWords = oldWords.filter((w) => !newSet.has(w));

  return { addedWords, removedWords, oldLength, newLength };
}

//Routes

// Save a new version
app.post("/save-version", (req, res) => {
  const { content } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({ error: "content must be a string" });
  }

  const diff = computeDiff(lastContent, content);

  const version = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    addedWords: diff.addedWords,
    removedWords: diff.removedWords,
    oldLength: diff.oldLength,
    newLength: diff.newLength,
    content,
  };

  versions.push(version);
  lastContent = content;

  return res.json({
    success: true,
    version,
    versions,
  });
});

// Get all versions
app.get("/versions", (req, res) => {
  return res.json(versions);
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
