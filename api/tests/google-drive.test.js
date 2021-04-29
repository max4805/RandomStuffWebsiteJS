const axios = require('axios');
const googleDrive = require('../services/google-drive');

jest.mock('axios');

beforeEach(() => {
    // we want to mock Google Drive APIs so that the folder structure looks like this:
    //
    // f1
    // -- 17 (image/png)
    // -- 18 (image/jpeg)
    // -- f2
    // -- -- 777 (image/png)
    // -- -- 84 (application/json)
    // -- -- f4
    // -- -- -- 885 (image/png)
    // -- f3
    // -- -- 584 (image/png)
    // -- -- 882 (image/png)

    const folder1page1 = {
        data: {
            nextPageToken: '5a',
            files: [
                {
                    id: '17',
                    mimeType: 'image/png'
                },
                {
                    id: 'f2',
                    name: 'folder2',
                    mimeType: 'application/vnd.google-apps.folder'
                }
            ]
        }};

    const folder1page2 = {
        data: {
            files: [
                {
                    id: '18',
                    mimeType: 'image/jpeg'
                },
                {
                    id: 'f3',
                    name: 'folder3',
                    mimeType: 'application/vnd.google-apps.folder'
                }
            ]
        }};

    const folder2 = {
        data: {
            files: [
                {
                    id: 'f4',
                    name: 'folder4',
                    mimeType: 'application/vnd.google-apps.folder'
                },
                {
                    id: '777',
                    mimeType: 'image/png'
                },
                {
                    id: '84',
                    mimeType: 'application/json'
                }
            ]
        } };

    const folder3 = {
        data: {
            files: [
                {
                    id: '584',
                    mimeType: 'image/png'
                },
                {
                    id: '882',
                    mimeType: 'image/png'
                }
            ]
        }};

    const folder4 = {
        data: {
            files: [
                {
                    id: '885',
                    name: 'woohoo.png',
                    mimeType: 'image/png'
                }
            ]
        }};

    process.env.GOOGLE_DRIVE_KEY = 'fakeKey';
    axios.get.mockImplementation(url => {
        switch (url) {
        case 'https://www.googleapis.com/drive/v3/files?key=fakeKey&q=\'f1\'%20in%20parents%20and%20trashed%20%3D%20false':
            return Promise.resolve(folder1page1);
        case 'https://www.googleapis.com/drive/v3/files?key=fakeKey&q=\'f1\'%20in%20parents%20and%20trashed%20%3D%20false&pageToken=5a':
            return Promise.resolve(folder1page2);
        case 'https://www.googleapis.com/drive/v3/files?key=fakeKey&q=\'f2\'%20in%20parents%20and%20trashed%20%3D%20false':
            return Promise.resolve(folder2);
        case 'https://www.googleapis.com/drive/v3/files?key=fakeKey&q=\'f3\'%20in%20parents%20and%20trashed%20%3D%20false':
            return Promise.resolve(folder3);
        case 'https://www.googleapis.com/drive/v3/files?key=fakeKey&q=\'f4\'%20in%20parents%20and%20trashed%20%3D%20false':
            return Promise.resolve(folder4);
        default:
            return Promise.reject();
        }
    });
});

test('listing multipage folder', async() => {
    const fileListing = await googleDrive.listFilesInFolder('f1');
    expect(fileListing.map(file => file.id)).toStrictEqual(['17', 'f2', '18', 'f3']);
});

test('listing folder recursively', async() => {
    const fileListing = await googleDrive.listFilesInFolderRecursive('f1', 'image/png', 'folder1');
    expect(fileListing.map(file => file.id)).toStrictEqual(['17', '777', '885', '584', '882']);
    expect(fileListing.map(file => file.folder)).toStrictEqual(['folder1', 'folder1/folder2', 'folder1/folder2/folder4', 'folder1/folder3', 'folder1/folder3']);
});

test('finding file by path', async() => {
    const fileId = await googleDrive.getFileIdByPath('f1', 'folder2/folder4/woohoo.png');
    expect(fileId).toBe('885');
});

test('not finding file by path (non-existing folder)', async() => {
    const fileId = await googleDrive.getFileIdByPath('f1', 'folder2/folder42/woohoo.png');
    expect(fileId).toBeNull();
});

test('not finding file by path (non-existing file)', async() => {
    const fileId = await googleDrive.getFileIdByPath('f1', 'folder2/folder4/whoops.png');
    expect(fileId).toBeNull();
});
