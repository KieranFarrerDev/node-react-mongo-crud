const { insertFreeTextRecord, fetchRandomFreeTextRecord, deleteFreeTextRecord } = require ('./freeTextController');
require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/api/data', (req, res) => {
    fetchRandomFreeTextRecord().then((result) => {
        res.json({ message: result });
    });
});

app.post('/api/data', (req, res) => {
    console.log('Debug info:', req.body.text);
    insertFreeTextRecord(req.body.text).then((result) => {
        res.json({ message: result });
    });
});

app.delete('/api/data', (req, res) => {
    console.log('Debug info:', req.body.textId);
    deleteFreeTextRecord(req.body.textId).then((result) => {
        res.json({ message: result });
    });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, process.env.FRONT_END_DIR_ROOT, '/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.FRONT_END_DIR_ROOT, '/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});