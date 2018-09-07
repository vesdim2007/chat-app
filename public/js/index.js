const socket = io()

socket.on('connect', () => {
    console.log("Connected to the server")     
    
})

socket.on('disconnect', () => {
    console.log("Disconnected from the server")
})

socket.on('newMessage', (message) => {
    console.log("new message", message)
})