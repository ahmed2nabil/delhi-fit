// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = (req, res, next) => {
  // Read the Authorization header
  const authHeader = req.header('Authorization');

  // Check if the header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1]; // Get the token part after 'Bearer '

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
