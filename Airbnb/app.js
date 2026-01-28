const express = require('express')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


//default route
app.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to Airbnb API'})
});

//home route
app.get('/home', (req, res) => {
    res.render('home', { title: 'Airbnb : Home' });
});

// page not found handler
app.use((req, res) => {
    res.status(404).json({message: 'Page not Found'})
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        message: message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;