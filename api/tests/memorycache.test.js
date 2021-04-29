const memorycache = require('../services/memorycache');

test('should cache for 2 seconds', async() => {
    const fn = jest.fn();
    fn.mockResolvedValue(18);

    // run for 1.5 seconds
    const start = new Date().getTime()
    while (new Date().getTime() < start + 1500) {
        const result = await memorycache('test', 1000, fn);
        expect(result).toBe(18);
    }

    // actual method was only called twice
    expect(fn).toHaveBeenCalledTimes(2);
});
