const express=require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')
const publicPath = path.join(__dirname, '../public')
const {generateMessage, generateLocationMessage} = require('./utils/message')
const isEmpty = require('./utils/validate')
const {Clients} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const users = new Clients()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log("New user connected")    

    socket.on('join', (params, callback) => {
        const {name, room} = params
        if(isEmpty(name) || isEmpty(room)) {
            return callback("Name and room name are required") 
        }

        socket.join(room)
            //socket.leave(room) for leaving the room and the group

            //io.emit => io.to(room).emit            
            //socket.broadcast.emit => socket.broadcast.to(room).emit
            //socket.emit 

        users.removeUser(socket.id)
        users.addUser(socket.id, name, room)
        io.to(room).emit('updateUsers', users.getUserList(room))        
        socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"))

        socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${name} has joined`))
        callback()   
            
        
    })

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id)        

        //sending message to everybody including the author
        if(user) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
        callback() 
        }               
    })

    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id)     

        if(user) {
            io.to(user.room).emit(
                'newLocationMessage', 
                generateLocationMessage(user.name, coords.latitude, coords.longitude)
            )
        }
        
    })

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('updateUsers', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage("Admin", `${user.name} has left`))
        }
    })
})

const port = process.env.PORT || 3000

server.listen(port)