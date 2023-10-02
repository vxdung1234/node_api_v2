const express = require('express');
const router = express.Router();
const ROLE_LIST = require('../../config/ROLE_LIST');
const verifyRoles = require('../../middleware/verifyRoles');
const userController = require('../../controllers/userController');

router.route('/')
    .get(verifyRoles(ROLE_LIST.Admin), userController.getAllUsers)
    .put(userController.updateUser);

router.route('/:id')
    .get(verifyRoles(ROLE_LIST.Admin), userController.getUser)
    .delete(verifyRoles(ROLE_LIST.Admin), userController.deleteUser);


module.exports = router;