const express = require('express');
const app = express();
const db = require('./config/database');
const locationRoutes = require('./routes/locationRoutes');
// Connect to the database
db.authenticate()
 .then(() => console.log('Database connected'))
 .catch((err) => console.error('Error connecting to database:', err));
// Middleware to parse JSON requests
app.use(express.json());
// Routes
app.use('/locations', locationRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});