const express = require('express');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('./utils/asyncHandler');
const { addHome } = require('./controllers/addHome.controller');
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


//default route
app.get('/', (req, res) => {
    res.redirect('/home');
});

//home route
app.get('/home', (req, res) => {
    res.render('home', { title: 'Airbnb : Home' });
});

app.get('/add-home', (req, res) => {
    res.render('addHome', { title: 'Airbnb : Add Home' });
});

app.post('/add-home', addHome);

app.get('/listings',(req, res) => {
    try {
    const listingsPath = path.join(__dirname, 'db/home.db.json');
    fs.readFile(listingsPath, 'utf8', (err, data) => {
        if (err) {
            throw new Error('Error reading listings file');
        }
        const listings = JSON.parse(data);
        const added = req.query.added === 'true';
        res.render('listings', { title: 'Airbnb : Listings', listings: listings, added  });
    });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// page not found handler
app.use((req, res) => {
    res.status(404).render('notfound', { title: '404 - Page Not Found' });
});

// Error handling middleware
app.use(require('./middlewares/error.middleware'));

module.exports = app;