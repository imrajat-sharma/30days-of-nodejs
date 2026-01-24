const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//USER ROUTES

app.use('/users', require('./src/routes/user.routes'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


module.exports = app;