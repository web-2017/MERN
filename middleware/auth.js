const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if(!token)
            res.status(401).json({msg: 'No auth token, auth denied'})

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if(!verified)
            res.status(401).json({msg: 'Token verification failed, auth denied'})
        
        req.user = verified.id
        next()
    }  catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = auth

