const wipes = require('../services/wipes');

test('should convert a complex wipe to triangles', async() => {
    jest.setTimeout(30000);
    const triangles = await wipes.convertWipeToTriangles('tests/assets/testwipe.png');
    expect(triangles).not.toBeNull();
    expect(triangles.length > 1000).toBe(true);
});

test('should convert worst case to triangles', async() => {
    jest.setTimeout(60000);
    const triangles = await wipes.convertWipeToTriangles('tests/assets/checkers.png');
    expect(triangles).not.toBeNull();
    expect(triangles.length).toBe(2073600);
});

test('should convert a black wipe to 2 triangles', async() => {
    const triangles = await wipes.convertWipeToTriangles('tests/assets/testwipe_black.png');
    expect(triangles).toHaveLength(2);
});

test('should convert a white wipe to no triangles', async() => {
    const triangles = await wipes.convertWipeToTriangles('tests/assets/testwipe_white.png');
    expect(triangles).toHaveLength(0);
});

test('should not convert a wipe that is not an image', async() => {
    const triangles = await wipes.convertWipeToTriangles('tests/assets/testnotwipe.txt');
    expect(triangles).toBeNull();
});
