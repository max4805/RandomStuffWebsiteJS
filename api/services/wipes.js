const jimp = require('jimp');

/**
 * Converts a wipe image to an array of triangles
 * for usage in the game instead of loading full HD sprites.
 *
 * Each triangle is an array of length 3, each point being represented by an [x, y] array.
 *
 * @param {String} path Path to the image to convert to triangles
 * @returns {Array{Array{Array{Number}}}|null} An array of triangles, or null if the image could not be read
 */
const convertWipeToTriangles = async(path) => {
    let image;
    try {
        image = await jimp.read(path);
    }
    catch (e) {
        console.error(`Could not load image ${path} for triangle conversion`, e);
        return null;
    }

    const solution1 = findTriangles(image.clone(), true);
    image = await jimp.read(path);
    const solution2 = findTriangles(image, false);

    // we want to retain the solution with the least amount of triangles.
    return solution1.length < solution2.length ? solution1 : solution2;
};

/**
 * Seeks for triangles going with this strategy:
 * - go through the image looking for a black pixel
 * - extend a rectangle from this pixel
 * - paint the rectangle white and save it in the form of 2 triangles
 * - repeat
 * @param {Jimp} image Jimp image to convert to triangles
 * @param {Boolean} verticalScan true to go through the image vertically first, false to go through it horizontally first
 * @returns {Array{Array{Array{Number}}}} An array of triangles
 */
const findTriangles = (image, verticalScan) => {
    const result = [];

    let x = 0, y = 0;
    while (x < image.bitmap.width && y < image.bitmap.height) {
        const idx = image.getPixelIndex(x, y);
        if (isBlack(image.bitmap.data.slice(idx, idx + 4))) {
            // black pixel! extend rectangle from here.
            const dimensions1 = extendRectangleFrom(image, x, y, true);
            const dimensions2 = extendRectangleFrom(image, x, y, false);

            // we want to keep the rectangle with the biggest area, and remove it from the image.
            let definitiveTriangles;
            if (dimensions1[0] * dimensions1[1] > dimensions2[0] * dimensions2[1]) {
                definitiveTriangles = getTrianglesFromRectangle(x, y, dimensions1[0], dimensions1[1]);
                image.scan(x, y, dimensions1[0], dimensions1[1], (_x, _y, idx) => image.bitmap.data[idx + 3] = 0);
            }
            else {
                definitiveTriangles = getTrianglesFromRectangle(x, y, dimensions2[0], dimensions2[1]);
                image.scan(x, y, dimensions2[0], dimensions2[1], (_x, _y, idx) => image.bitmap.data[idx + 3] = 0);
            }

            // and save them to the list.
            definitiveTriangles.forEach(s => result.push(s));
        }

        if (verticalScan) {
            // move down, then right if we reached the bottom
            y++;
            if (y >= image.bitmap.height) {
                y = 0;
                x++;
            }
        }
        else {
            // move right, then down if we reached the bottom
            x++;
            if (x >= image.bitmap.width) {
                x = 0;
                y++;
            }
        }
    }

    return result;
}

/**
 * Extends a rectangle as far as possible from the given top-left position, until it hits a non-black pixel.
 * @param {Jimp} image Jimp image to convert to triangles
 * @param {Number} x the starting X position
 * @param {Number} y the starting Y position
 * @param {Boolean} verticalScan true to extend the rectangle vertically first, false to extend it horizontally first
 * @returns {Array{Number}} the width and height of the rectangle found
 */
const extendRectangleFrom = (image, x, y, verticalScan) => {
    let width = 1, height = 1;
    if (verticalScan) {
        // extend height, then width, while the contents of the rectangle are all black.
        let idx = image.getPixelIndex(x, y + height);
        while (y + height < image.bitmap.height - 1 && isBlack(image.bitmap.data.slice(idx, idx + 4))) {
            height++;
            idx = image.getPixelIndex(x, y + height);
        }
        while (x + width < image.bitmap.width - 1 && rectangleIsAllBlack(image, x + width, y, 1, height)) {
            width++;
        }
    }
    else {
        // extend width, then height, while the contents of the rectangle are all black.
        let idx = image.getPixelIndex(x + width, y);
        while (x + width < image.bitmap.width && isBlack(image.bitmap.data.slice(idx, idx + 4))) {
            width++;
            idx = image.getPixelIndex(x + width, y);
        }
        while (y + height < image.bitmap.height && rectangleIsAllBlack(image, x, y + height, width, 1)) {
            height++;
        }
    }
    return [width, height];
}

/**
 * Checks if all the pixels in the given rectangle are black.
 * @param {Jimp} image Jimp image to convert to triangles
 * @param {Number} x the starting X position
 * @param {Number} y the starting Y position
 * @param {*} width the width of the rectangle
 * @param {*} height the height of the rectangle
 * @returns {Boolean} whether all the pixels in the rectangle are black.
 */
const rectangleIsAllBlack = (image, x, y, width, height) => {
    let allBlack = true;
    image.scan(x, y, width, height, (_x, _y, idx) => {
        if (!isBlack(image.bitmap.data.slice(idx, idx + 4))) {
            allBlack = false;
        }
    });

    return allBlack;
}

/**
 * Checks if the color given is black (or at least somewhat black).
 * @param {Array{Number}} color an array with the 4 components of the color: [r, g, b, a]
 * @returns whether the given color is black
 */
const isBlack = (color) => {
    return color[0] < 128 && color[1] < 128 && color[2] < 128 && color[3] > 128;
}

/**
 * Splits a rectangle into 1 or 2 triangles.
 * (If a "rectangle" is just a line or a single pixel, it can be represented with a single triangle.)
 *
 * @param {Number} x the starting X position
 * @param {Number} y the starting Y position
 * @param {*} width the width of the rectangle
 * @param {*} height the height of the rectangle
 * @returns {Array{Array{Number}}} an array containing 1 or 2 triangles
 */
const getTrianglesFromRectangle = (x, y, width, height) => {
    // first triangle
    const tri1 = [[x, y], [x + width - 1, y], [x + width - 1, y + height - 1]];

    // second triangle, only necessary if the rectangle is actually a rectangle (not a line or a single pixel)
    if (width !== 1 && height !== 1) {
        const tri2 = [[x, y], [x, y + height - 1], [x + width - 1, y + height - 1]];
        return [tri1, tri2];
    }

    return [tri1];
}

module.exports = { convertWipeToTriangles };
