const expect = require('expect')
const {generateMessage, generateLocationMessage} = require('../utils/message')

describe("generateMessage", () => {
    it("should generate correct message object", () => {
        const from = "Vesy"
        const text = "Some message"
        const message = generateMessage(from, text)

        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({ from, text })
    })
})

describe("generateLocationMessage", () => {
    it("should generate correct location object", () => {
        const from = "Vesy"
        const latitude = "43.212495"
        const longitude = "43.212495"
        const url = 'https://www.google.com/maps?q=43.212495,43.212495'
        const message = generateLocationMessage(from, latitude, longitude)

        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({ from, url, createdAt })
    })
})