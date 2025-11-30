# Mini Audit Trail Generator

A lightweight web application that tracks changes between multiple versions of text content.
Each time a version is saved, the system automatically computes:

### Added words

### Removed words

### Old vs new word count

### Timestamp

### Full content snapshot (for reverting)


## Features

### Core features

Save versions of text content

Added words & Removed words

Old length & New length

Display complete version history

Backend storage using in-memory array

### Additional Features (Enhanced Functionality)

Revert to any previous version

Download complete version history as a JSON report

Visual highlighting of added (green) and removed (red) words

Clean, modern UI with responsive layout

## Tech Stack
Frontend

React (Vite), TypeScript, Modern CSS styling

Backend

Node.js, Express.js, CORS, UUID

In-memory array for storage (as per assignment guideline)


## Installation & Setup
1. Clone the repository

'''
git clone https://github.com/Taniishaaa/text-history-generator

'''

2. Backend Setup

'''
cd backend

npm install

npm start
'''


Your backend will run at: http://localhost:4000

3. Frontend Setup

'''
cd frontend

npm install

npm run dev
'''

Open the URL shown in your terminal (usually http://localhost:5173).

### API Endpoints

1. POST /save-version: Saves a new version and returns updated version history.

Request body:

{
  "content": "your text here"
}


Response:

{
  "success": true,
  "version": { ... },
  "versions": [ ... ]
}

2. GET /versions: Returns all saved versions.

Response:

[
  {
    "id": "...",
    "timestamp": "...",
    "addedWords": [],
    "removedWords": [],
    "oldLength": 0,
    "newLength": 5,
    "content": "full content here"
  }
]

## How the Difference Works

When content is saved:

Previous content and new content are split into words. Words appearing only in new text are added and Words appearing only in previous text are removed.

The number of words in both versions is counted. A version object is created and stored in an in-memory array.

This ensures fast performance and fulfills the assignment requirement (“in-memory array acceptable for 2 hours”).

## UI Features

Highlighted added words → green chips

Highlighted removed words → red chips

Scrollable version list

“Revert to Version” button

“Download JSON Report” button

## Downloading Version Report

Click "Download JSON Report" to export all version history as a JSON file:
version-history.json

This is useful for audits, debugging, and compliance logs.

