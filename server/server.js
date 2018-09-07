const express=require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')
const publicPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log("New user connected")

    socket.emit('newMessage', {
        from: "Admin",
        text: "Welcome to the chat app",
        createdAt: new Date().getTime()
    })

    socket.broadcast.emit("newMessage", {
        from: "Admin",
        text: "New user joined",
        createdAt: new Date().getTime()
    })

    socket.on('createMessage', (message) => {
        console.log('createMessage', message)        

        //sending message to everybody including the author
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })

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