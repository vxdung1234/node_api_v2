const User = require('../models/User');
const bcrypt = require('bcrypt');
const ROLE_LIST = require('../config/ROLE_LIST');

const getUser = async (req, res) => {
    if(!req.params?.id) {
        return res.json({status: 400, message: 'User ID is required.'})
    }
    const user = await User.findOne({_id: req.params.id}).exec();
    if(!user) {
        return res.json({status: 204});
    }
    res.json({status: 200, data: user});
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().exec();
        if (!users) {
            return res.json({ status: 204 });
        }
        res.json({ status: 200, data: users })
    } catch (e) {
        return res.json({ status: 500, message: e.message });
    }
};

const updateUser = async (req, res) => {
    try {   
        if(!req.body?.id) {
            return res.json({status: 400, message: 'User ID is required.'})
        }
        const foundUser = await User.findOne({_id: req.body.id}).exec();
        if(!foundUser) {
            return res.json({status: 204});
        }
        if(Object.values(foundUser.roles).includes(ROLE_LIST.Admin) && req.username !== foundUser.username) {
            return res.json({status: 403, message: 'You have not chance this account'})
        }
        if(req.body.password) {
            foundUser.password = await bcrypt.hash(req.body.password, 10);
        }
        const result = await foundUser.save();
        if(!result) {
            return res.json({status: 500});
        }
        res.json({status: 200, message: `${foundUser.username} has updated!`})
    } catch(e) {
        res.json({status: 500, message: e.message});
    }
};

const deleteUser = async (req, res) => {
    try {   
        if(!req.params?.id) {
            return res.json({status: 400, message: 'User ID is required.'})
        }
        const foundUser = await User.findOne({_id: req.params.id}).exec();
        if(!foundUser) {
            return res.json({status: 204});
        }
        if(Object.values(foundUser.roles).includes(ROLE_LIST.Admin)) {
            return res.json({status: 403, message: 'You have not access to delete this account.'})
        }
        const result = await foundUser.deleteOne();
        if(!result) {
            return res.json({status: 500});
        }
        res.json({status: 200, message: `${foundUser.username} has deleted!`})
    } catch(e) {
        res.json({status: 500, message: e.message});
    }
};

module.exports = {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
}