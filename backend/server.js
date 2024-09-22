const app = require('./app');
const connectDB = require('./db/dbConnection');

const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});