const socket = io()

socket.on('connect', () => {
    console.log("Connected to the server")     
    
})

socket.on('disconnect', () => {
    console.log("Disconnected from the server")
})

socket.on('newMessage', (message) => {
    console.log("new message", message)
    const messageEl = document.createElement('li')
    messageEl.textContent = (`${message.from}: ${message.text}`)
    document.querySelector('#messages').appendChild(messageEl)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    
    const inputEl = document.querySelector('#message-input')
    const text = (inputEl.value)    

    if (text.length > 0) {
        socket.emit('createMessage', {
            from: "User",
            text           
        }, function() {

        })
        inputEl.value = ""
    }
    
})