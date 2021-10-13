const express = require('express')
const {getUserForAuth, addUser} = require('../controllers/user')
const router = express.Router()

router.route('/').get(getUserForAuth).post(addUser)

module.exports = router
