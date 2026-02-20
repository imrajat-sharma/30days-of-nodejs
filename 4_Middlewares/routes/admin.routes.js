const path = require('path');
const fs = require('fs');
const express = require('express');

const adminRouter = express.Router();

const adminMiddleware = require('../middlewares/admin.middleware');

adminRouter.get('/',(req, res, next) => {
    res.send('<html><head><title>Admin Page</title></head><body><h1>Welcome to the Admin Page</h1><h3>Admin Dashboard</h3><form action="/admin/dashboard" method="post"><input type="text" name="user" placeholder="Enter User Name" required /><input type="password" name="password" placeholder="Enter Password" required /><button type="submit">Login</button><button type="submit">Go to Home Page</button></form></body></html>');
    next();
}, adminMiddleware,(req, res) => {
    res.send('<a href="/admin/dashboard?username=admin">Go to Admin Dashboard</a>');
});

adminRouter.get('/dashboard', (req, res) => {
    const {username} = req.query;
    res.send(`<h2>Admin Dashboard</h2><p>Welcome ${username} to the admin dashboard.</p>`);
});

adminRouter.get('/users', (req, res) => {
    res.send('<h2>Manage Users</h2><p>This is the user management page.</p>');
});

adminRouter.get('/settings', (req, res) => {
    res.send('<h2>Admin Settings</h2><p>This is the admin settings page.</p>');
});
module.exports = adminRouter;