const express=require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')
const publicPath = path.join(__dirname, '../public')
const {generateMessage} = require('./utils/message')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log("New user connected")

    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"))

    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"))

    socket.on('createMessage', (message) => {
        console.log('createMessage', message)        

        //sending message to everybody including the author
        io.emit('newMessage', generateMessage(message.from, message.text))

        //broadcasting messages to everybody, except the author
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })

    socket.on('disconnect', () => {
        console.log("User is disconnected")
    })
})

const port = process.env.PORT || 3000

server.listen(port)