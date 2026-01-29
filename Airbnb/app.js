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

app.get('/listings', (req, res) => {
    res.render('listings', { title: 'Airbnb : Listings', listings: {title: 'Cozy Cottage', description: 'A cozy cottage in the countryside.', price: 120, image: 'https://imgs.search.brave.com/EtvfNpmFBgfVMbqiQimcaWeukCvlFJM5_m62MZTE_1E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE4/NTczMDM2MC9waG90/by9ob3VzZS13aXRo/LXBvb2wtc3Vycm91/bmRlZC1ieS1uYXR1/cmUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPTlEa3pITzN3/Qlh1UDdVN3NvUUEw/VWFLc0x3UFk4N24t/Y2xsYk5nNTFtLVU9'} });
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