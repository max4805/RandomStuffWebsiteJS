const googleDrive = require('./google-drive');
const fs = require('fs');
const fsPromises = require('fs/promises');
const archiver = require('archiver');
const debug = require('debug')('assets');

/**
 * Retrieves the contents of a given asset category
 * @param {String} category The category to retrieve
 * @returns {Promise<Array<String> | null>} A list of assets in this category, or null if the category does not exist.
 */
const getAssetCategoryContents = async(category) => {
    const googleDriveFolder = (await googleDrive.listFilesInFolder(process.env.CELESTE_ASSETS_ROOT_FOLDER))
        .filter(folder => folder.name.toLowerCase() === category.toLowerCase())[0];

    if (googleDriveFolder === undefined) {
        return null;
    }

    return (await googleDrive.listFilesInFolderRecursive(googleDriveFolder.id, 'image/png', googleDriveFolder.name))
        .map(file => file.folder + '/' + file.name);
}

/**
 * Downloads an asset based on its path.
 * @param {String} path The path to the file
 * @returns {Promise<ReadableStream> | null} The contents of the file, or null if the file wasn't found.
 */
const downloadAssetByPath = async(path) => {
    const fileId = await googleDrive.getFileIdByPath(process.env.CELESTE_ASSETS_ROOT_FOLDER, path);
    if (fileId === null) {
        return null;
    }
    return await googleDrive.downloadFile(fileId);
};

const copyStream = (from, to) => new Promise((resolve, reject) => {
    from.on('end', () => resolve());
    from.on('error', e => reject(e));
    from.pipe(to);
});

/**
 * Downloads all of the requested assets, and sends them as a zip, structuring tilesets, stylegrounds and decals properly.
 * @param {String} baseDirectory The directory/directories to use for mod structure
 * @param {String[]} files The files to include in the zip
 * @returns {Object | null} an object where "directory" is the temp directory and "file" is the full path to the built zip, or null if no file was found.
 */
const packageAssets = async(baseDirectory, files) => {
    const tempdir = await fsPromises.mkdtemp('/tmp/zip_sprites_');

    debug('Exporting files to zip: %o with base directory %s', files, baseDirectory);

    let hasFiles = false;

    // download assets
    await Promise.all(files
        .map(async(file) => {
            const rootDirectory = file.split('/')[0];
            let destinationPath = file;
            if (rootDirectory === 'Tilesets') {
                destinationPath = `Graphics/Atlases/Gameplay/tilesets/${baseDirectory}/${file.substring(file.lastIndexOf('/') + 1)}`;
            }
            else if (rootDirectory === 'Stylegrounds') {
                destinationPath = `Graphics/Atlases/Gameplay/bgs/${baseDirectory}/${file.substring(file.lastIndexOf('/') + 1)}`;
            }
            else if (rootDirectory === 'Decals') {
                destinationPath = `Graphics/Atlases/Gameplay/decals/${baseDirectory}/${file.substring(file.lastIndexOf('/') + 1)}`;
            }
            else {
                destinationPath = `Misc/${file.substring(file.lastIndexOf('/') + 1)}`;
            }
            const fileStream = await downloadAssetByPath(file);
            if (fileStream !== null) {
                await fsPromises.mkdir(tempdir + '/contents/' + destinationPath.substring(0, destinationPath.lastIndexOf('/')), { recursive: true });

                const writeStream = fs.createWriteStream(tempdir + '/contents/' + destinationPath);
                await copyStream(fileStream, writeStream);
                hasFiles = true;
            }
        }));

    if (!hasFiles) {
        return null;
    }

    // zip them
    const zip = fs.createWriteStream(tempdir + '/sprites.zip');
    const archive = archiver('zip');
    archive.pipe(zip);
    archive.directory(tempdir + '/contents', false);
    await archive.finalize();

    // clear temp directory
    await fsPromises.rm(tempdir + '/contents', { recursive: true });

    // return the file
    return { directory: tempdir, file: tempdir + '/sprites.zip' };
}

module.exports = { getAssetCategoryContents, downloadAssetByPath, packageAssets };
