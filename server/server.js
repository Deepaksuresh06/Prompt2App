require('dotenv').config();   // 1. Load env variables first

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

connectDB();                  // 2. Connect DB

app.use(cors());              // 3. Middleware
app.use(express.json());

// Routes
app.use('/auth', require('./routes/login'));
app.use('/api', require('./routes/generation'));

const PORT = process.env.PORT || 5000;   // 4. Use env variables after config

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});