const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the user model
const app = express();
const bcrypt = require('bcrypt');


app.use(express.json());  

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error: ', err));


app.post('/api/register', async (req, res) => {
    
    console.log('Request body:', req.body);
  
    try {
      const { username, email, password, role } = req.body;
  
     
      if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
     
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
  
      
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role
      });
  
      
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
