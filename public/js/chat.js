const socket = io()

let newMessageHeight = 0
const scrollToBottom = () => {
    const messages = document.querySelector('#messages')
    const newMessage = messages.lastElementChild
    const {clientHeight, scrollTop, scrollHeight} = messages
    const prevMessageHeight = newMessageHeight
    newMessageHeight = parseInt(window.getComputedStyle(newMessage).getPropertyValue('height'))
    if(clientHeight + scrollTop + newMessageHeight + prevMessageHeight >= scrollHeight) {
        messages.scrollTo(0, scrollHeight)
    }
}

socket.on('connect', () => {
    
    const params = new URLSearchParams(window.location.search) 
    const obj = {
        name: params.get('name'),
        room: params.get('room') 
    }
    
    socket.emit('join', obj, function(err) {
        
        if(err) {
            alert(err)
            window.location.href='/'
        } else {
            console.log('No errors')
        }
    })
    
})

socket.on('updateUsers', (users) => {
    const peopleList = document.createElement('ol')
    users.forEach((name) => {
        const listItem = document.createElement('li')
        listName = document.createTextNode(name)
        listItem.appendChild(listName)
        peopleList.appendChild(listItem)
    })
    document.querySelector('#users').appendChild(peopleList)
})

socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a')
    const template = document.querySelector('#message-template').innerHTML
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })

    document.querySelector('#messages').innerHTML += html
    scrollToBottom()
})

socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a')
    const template = document.querySelector('#location-template').innerHTML
    const html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    })

    document.querySelector('#messages').innerHTML += html
    scrollToBottom()
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    
    const inputEl = document.querySelector('#message-input')
    const text = (inputEl.value)   

    if (text.length > 0) {
        socket.emit('createMessage', {
            text           
        }, function() {
            inputEl.value = ""
        })
        
    }
    
})

const locationBtn = document.querySelector('#send-location')
locationBtn.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    locationBtn.setAttribute('disabled', true)

    navigator.geolocation.getCurrentPosition((position) => {
        locationBtn.removeAttribute("disabled")
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, () => {
        locationBtn.removeAttribute("disabled")
        alert('Unable to fetch location')
    })    
})

socket.on('disconnect', () => {
    console.log("Disconnected from the server")
})

