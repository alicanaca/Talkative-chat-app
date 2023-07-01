import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB connection successful at: ${connect.connection.host}`)
    } catch (error) {
        console.log(error.message)
        process.exit()
    }
}

export default connectDB