const expect = require('expect')
const {generateMessage} = require('../utils/message')

describe("generateMessage", () => {
    it("should generate correct message object", () => {
        const from = "Vesy"
        const text = "Some message"
        const message = generateMessage(from, text)

        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({ from, text })
    })
})