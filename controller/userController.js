const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


// Registered user
const register_post = async (req, res) => {
    try {
        let {
            email,
            password,
            passwordCheck,
            displayName
        } = req.body

        // validate
        if (!email || !password || !passwordCheck)
            res.status(400).json({
                msg: 'Not all field have been entered.'
            })
        if (password.length < 5)
            res.status(400).json({
                msg: 'Password needs to be at least 5 characters long.'
            })
        if (password !== passwordCheck)
            res.status(400).json({
                msg: 'Enter the save password twice for verification'
            })
        const existingUser = await User.findOne({
            email: email
        })

        if (existingUser)
            res.status(400).json({
                msg: 'An account with this email already exist'
            })
        if (!displayName) displayName = email

        // шифрование паролей на бэк
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        // создание нового юзера
        const newUser = new User({
            email,
            password: passwordHash,
            displayName
        })

        // сохранение нового юзера
        const savedUser = await newUser.save()
        res.json(savedUser)

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
// Log in user
const login_post = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        // validate
        if (!email || !password)
            res.status(400).json({
                msg: 'Not all field have been entered.'
            })

        // Поиск по email
        const user = await User.findOne({
            email: email
        })
        if (!user)
            res.status(400).json({
                msg: 'No account with this email has been registered'
            })

        // Несовпадение пароля 
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) res.status(400).json({
            msg: 'Invalid credentials'
        })

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// Delete user
const delete_user = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// Varification token
const valid_post_token = async (req, res) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) res.json(false)

        const user = await User.findById(verified.id)
        if (!user) res.json(false)

        return res.json(true)

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const get_current_user = async (req, res) => {
    const user = await User.findById(req.user)
    console.log(req.user);
    res.json(user)
}

module.exports = {
    login_post,
    register_post,
    delete_user,
    valid_post_token,
    get_current_user
}