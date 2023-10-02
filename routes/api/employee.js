const express = require('express');
const router = express.Router();
const ROLE_LIST = require('../../config/ROLE_LIST');
const verifyRoles = require('../../middleware/verifyRoles');
const employeeController = require('../../controllers/employeeController');

router.route('/')
    .get(employeeController.getAllEmployees)
    .post(verifyRoles(ROLE_LIST.Admin), employeeController.createEmployee)
    .put(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), employeeController.updateEmployee)

router.route('/:id')
    .get(employeeController.getEmployee)
    .delete(verifyRoles(ROLE_LIST.Admin), employeeController.deleteEmployee);

module.exports = router;
