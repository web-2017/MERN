const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
// User Schema
const User = require('../models/userModel')
// auth middleware
const auth = require('../middleware/auth')
// User Controllers
const {
    login_post,
    register_post,
    delete_user,
    valid_post_token,
    get_current_user
} = require('../controller/userController')

// Routers
// register
router.post('/register', register_post)
// login
router.post('/login', login_post)
// delete
router.delete('/delete', auth, delete_user)
// check is valid token
router.post('/tokenIsValid', valid_post_token)
// current login user
router.get('/', auth, get_current_user)

module.exports = router