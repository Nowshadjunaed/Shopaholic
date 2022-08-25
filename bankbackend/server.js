import dotenv from 'dotenv'
import express from 'express'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import cors from "cors";


dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(cors());


app.get('/bankapi', (req, res) => {
    res.send('API is running...')
})

app.use('/bankapi/users', userRoutes)
app.use('/bankapi/payment', paymentRoutes)
app.use(notFound)
app.use(errorHandler)





const PORT = process.env.PORT_BANK || 7000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))