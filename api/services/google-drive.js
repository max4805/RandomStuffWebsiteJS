const debug = require('debug')('google-drive');
const axios = require('axios');

function listPageOfFilesInFolder(folderId, pageToken = null) {
    const url = `https://www.googleapis.com/drive/v3/files?key=${process.env.GOOGLE_DRIVE_KEY}&q=`
        + encodeURIComponent(`'${folderId}' in parents and trashed = false`)
        + (pageToken === null ? '' : `&pageToken=${pageToken}`);

    debug('File list: calling Google Drive URL %s', url);

    return axios.get(url);
}

/**
 * Gets the full list of files in a Google Drive folder.
 * @param {String} folderId The ID of the folder that should get listed
 * @returns {Promise<Array<Object>>} The list of files in this folder (non-recursive)
 */
const listFilesInFolder = async(folderId) => {
    // get first page
    let response = await listPageOfFilesInFolder(folderId);
    const fileList = response.data.files;

    // get subsequent pages as necessary
    while (response.data.nextPageToken) {
        response = await listPageOfFilesInFolder(folderId, response.data.nextPageToken);
        response.data.files.forEach(f => fileList.push(f));
    }

    return fileList;
};

/**
 * Gets the full list of files in a Google Drive folder of the given MIME type, recursively.
 * @param {String} folderId The ID of the folder that should get listed
 * @param {*} mimeTypeFilter The MIME type of the files to get
 * @param {*} folderPath The path of the folder that is currently crawled
 * @returns {Promise<Array<Object>>} The list of files in this folder
 */
const listFilesInFolderRecursive = async(folderId, mimeTypeFilter, folderPath = '') => {
    const fileList = await listFilesInFolder(folderId);

    // get files in this folder that match the MIME type
    const filesInThisFolder = fileList
        .filter(file => file.mimeType === mimeTypeFilter);
    filesInThisFolder.forEach(file => file.folder = folderPath);

    // get subfolders and query them
    return await fileList
        .filter(file => file.mimeType === 'application/vnd.google-apps.folder')
        .map(file => listFilesInFolderRecursive(file.id, mimeTypeFilter, folderPath + '/' + file.name))
        .reduce(async(list1, list2) => (await list1).concat(await list2), filesInThisFolder);
}

/**
 * Returns a file's ID based on its path.
 * @param {String} rootFolderId The ID of the root shared folder on Google Drive
 * @param {String} filePath The path to the file (using / as a separator)
 * @returns {String | null} The ID of the file, or null if it was not found
 */
const getFileIdByPath = async(rootFolderId, filePath) => {
    let currentFolderId = rootFolderId;
    for (const pathPart of filePath.split('/')) {
        const currentFolder = (await listFilesInFolder(currentFolderId))
            .map(list => list === null ? [] : list)
            .filter(file => file.name === pathPart)[0];

        if (currentFolder === undefined) {
            return null;
        }
        currentFolderId = currentFolder.id;
    }

    return currentFolderId;
}

/**
 * Downloads a file from Google Drive based on its ID.
 * @param {String} fileId The ID of the file to download
 * @returns {Promise<ReadableStream>} The contents of the file
 */
const downloadFile = async(fileId) => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${process.env.GOOGLE_DRIVE_KEY}&alt=media`;

    debug('File download: calling Google Drive URL %s', url);

    return (await axios.get(url, { responseType: 'stream' })).data;
}

module.exports = { listFilesInFolder, listFilesInFolderRecursive, getFileIdByPath, downloadFile };
