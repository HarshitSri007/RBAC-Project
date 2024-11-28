const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the user model
const app = express();
const bcrypt = require('bcrypt');


app.use(express.json());  // Middleware to parse JSON

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error: ', err));

// POST register route
app.post('/api/register', async (req, res) => {
    // Log the incoming request body to verify what is being sent
    console.log('Request body:', req.body);
  
    try {
      const { username, email, password, role } = req.body;
  
      // Validate that all required fields are present
      if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Check if user already exists by email
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password (ensure bcrypt is set up correctly)
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user and save it to the database
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role
      });
  
      // Save user to the database
      await user.save();
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Error registering user', error });
    }
  });

  const jwt = require('jsonwebtoken'); 
const JWT_SECRET = '10'; 


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Error logging in', error: error.message || error });
  }
});

  


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
