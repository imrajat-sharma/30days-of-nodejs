const express = require('express');
const router = express.Router();

const users = require('../db/user.db');


router.get('/', (req, res) => {
    if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
    }

    const {page, limit} = req.query;
    if (page && limit) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);   
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = pageNum * limitNum;
        const paginatedUsers = users.slice(startIndex, endIndex);
        return res.status(200).json(paginatedUsers);
    }
    res.status(200).json(users);
})

router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});

router.post('/', (req, res) => {
    const {name, email} = req.body;
    const newUser = {
        id: users.length + 1,
        name,
        email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

router.delete('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }   
    users.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = router;