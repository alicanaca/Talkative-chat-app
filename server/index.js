import express from 'express'
import dotenv from 'dotenv'
// import chats from './data/data.js'
import cors from 'cors'
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import notifRoutes from './routes/notifRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

connectDB()
const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use('/user', userRoutes)
app.use('/chat', chatRoutes)
app.use('/messages', messageRoutes)
app.use('/notif', notifRoutes)

app.use(notFound)
app.use(errorHandler)

// app.get("/chats", (req, res) => {
//     res.send(chats)
// })

const PORT = process.env.PORT

const server = app.listen(PORT, console.log(`Server listening on ${PORT}`))

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    })

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing")
    })

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat

        if (!chat.users) { return console.log('chat.users not defined') }

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) { return }

            socket.in(user._id).emit("message received", newMessageReceived)
        });
    })

    socket.off("setup", () => {
        socket.leave(userData._id)
    })
})