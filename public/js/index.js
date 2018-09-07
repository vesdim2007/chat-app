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

socket.on('newLocationMessage', (message) => {
    const locationEl = document.createElement('li')
    const mapEl = document.createElement('a')
    const author = (`${message.from}: `)
    mapEl.textContent = "My current location"
    mapEl.setAttribute('href', message.url)
    mapEl.setAttribute("target", "_blank")
    locationEl.textContent = author
    locationEl.appendChild(mapEl)
    document.querySelector('#messages').appendChild(locationEl)
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

const locationBtn = document.querySelector('#send-location')
locationBtn.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, () => {
        alert('Unable to fetch location')
    })
})