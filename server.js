require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const path = require('path');
const { requireLogger, errorLogger} = require('./middleware/logEvents');
const POST = process.env.POST || 3500;

// Connect to the database
connectDB();

// Middleware
app.use(requireLogger);
app.use('/', express.static(path.join(__dirname, '.', 'public')));

// Use for index page
app.use('^/$|/index(.html)?', (req, res) => {
    res.json({message: 'Welcome to API page!'});
})

// Routes



// Use for error routes
app.all('*', (req, res) => {
    res.json({message: '404 Not Found'});
});

app.use(errorLogger);

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(POST, () => console.log(`Server listening on ${POST}`));
})
