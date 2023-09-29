const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');

const handleRegister = async (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.json({ status: 400, message: 'Username or password is required' });
    }
    const { username, password } = req.body;
    try {
        const duplicateUser = await User.findOne({ username: username});
        if(duplicateUser) {
            return res.json({ status: 409, message: 'Duplicate username'});
        }
        const passwordhashed = await bcrypt.hash(password, 10);
        const role = req.body.role;
        if(role) {
            var roles = { 'User': 2001};
            switch (role) {
                case 'Admin':
                    roles.Admin = 5150;
                    break;
                case 'Editor':
                    roles.Editor = 1984;
                    break;
            }
        }
        const result = await User.create({
            username: username,
            password: password,
            roles: roles
        })
        if(!result) {
            return res.json({ status: 500, message: 'Cannot create user'});    
        }
        res.json({ status: 200, message: 'Created user'});
    } catch (err) {
        return res.json({ status: 500, message: err.message});
    }
};


module.exports = { handleRegister };