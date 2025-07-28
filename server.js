const express = require('express');
const connectDB = require('./db/connectDB');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());



app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Import routes

// User routes
const userRoutes = require('./routes/user.route');
// admin routes
const adminRoutes = require('./routes/admin.route');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
connectDB().then(() => {
    app.listen(process.env.PORT)
    console.log(`Server is running on port ${process.env.PORT}`);

})
.catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});

module.exports = app;