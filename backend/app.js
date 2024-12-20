const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const userInfoRoutes = require('./routes/usersInfoRoutes');
const planFileRoutes = require('./routes/planFileRoutes');

const errorHandler = require('./middleware/error');
const app = express();

const port = process.env.PORT || 3000;

// Middleware 
app.use(express.json()); //to parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
// Basic route

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/usersInfo', userInfoRoutes);
app.use('/api/planManagement', planFileRoutes);

// Error handling middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// More routes...
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


module.exports = app;