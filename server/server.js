const express=require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')
const publicPath = path.join(__dirname, '../public')
const {generateMessage, generateLocationMessage} = require('./utils/message')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log("New user connected")

    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"))

    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"))

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message)        

        //sending message to everybody including the author
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback()        
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    })

    socket.on('disconnect', () => {
        console.log("User is disconnected")
    })
})

const port = process.env.PORT || 3000

server.listen(port)