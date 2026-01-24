const express = require('express');

const userRouter = express.Router();

userRouter.get('/profile', (req, res) => {
    res.send('<h2>User Profile</h2><p>This is the user profile page.</p>');
});

userRouter.get('/dashboard', (req, res) => {
    res.send('<h2>User Dashboard</h2><p>Welcome to your dashboard.</p>');
});

userRouter.get('/settings', (req, res) => {
    res.send('<h2>User Settings</h2><p>This is the user settings page.</p>');
});

module.exports = userRouter;