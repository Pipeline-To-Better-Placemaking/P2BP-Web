const { testEnvironment } = require("../jest.config");

test('Jest is working', () => {
    const working = true

    expect(working).toBe(true)
})