const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

// https://www.youtube.com/watch?v=BKiiXXVb69Y

// set express 
const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Start port on: http://localhost:${PORT}`))

// set up mongoose
mongoose.connect(process.env.DB_CONNECTION, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) throw err
        console.log('Mongo DB connected');
    }
)

// set up routes
app.use('/users', require('./routes/userRouter'))