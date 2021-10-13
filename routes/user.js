const express = require('express')
const router = express.Router()
const {getUser, getUsers, addUser, updateUser, deleteUser} = require('../controllers/user')

router.route('/').get(getUsers).post(addUser)
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser)

// router.route('/:id').get(getUser).delete([authorizeRoles(['ROLE_ADMIN'])], deleteUser).patch(updateUser)

module.exports = router
