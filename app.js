require('dotenv').config()
require('express-async-errors')

// Express
const express = require('express')
const app = express()

// Routers
const userRouter = require('./routes/user')
const  vehicleRouter = require('./routes/vehicle')
const authRouter = require('./routes/auth')

// Database
const db = require('./database/connection')

// Middleware
const errorHandler = require('./middleware/error-handler')
const {authenticateUser, authorizeRoles} = require('./middleware/auth')



const port = process.env.PORT || 3000


app.use(express.json())
app.use('/api/v2/users', [authenticateUser, authorizeRoles('ROLE_ADMIN')], userRouter)
app.use('/api/v2/vehicles', authenticateUser, vehicleRouter)
app.use('/api/v2/auth/user', authRouter)


app.use(errorHandler)


const startApp = async () => {
    try {
        await db.connect(process.env.DB_URL + process.env.DB_NAME + process.env.DB_OPTIONS)
        app.listen(port, () => console.log('Server listening on port ' + port + '...'))
    } catch (e) {
        console.log(e)
    }
}

startApp()
