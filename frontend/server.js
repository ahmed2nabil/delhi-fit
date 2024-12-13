const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the Angular app's dist folder
app.use(express.static(path.join(__dirname, 'dist/frontend/browser')));

// Redirect all other routes to index.html (for Angular routing)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});