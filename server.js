require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Connected to MongoDB...'));

app.use(express.json())

app.use('/restaurant', require('./routes/restaurant'));
app.use('/product', require('./routes/product'));

const url = process.env.BACKEND_URL || "http://localhost";
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on ${url}:${port}`));
