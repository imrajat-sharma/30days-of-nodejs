const express = require('express');
const homeRoutes = require('./routes/home.route');
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use('/', homeRoutes);

// page not found handler
app.use((req, res) => {
    res.status(404).render('notfound', { title: '404 - Page Not Found' });
});

// Error handling middleware
app.use(require('./middlewares/error.middleware'));

module.exports = app;
