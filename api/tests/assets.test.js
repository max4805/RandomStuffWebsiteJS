const assetService = require('../services/assets');
const googleDrive = require('../services/google-drive');

jest.mock('../services/google-drive');

test('should not find category', async() => {
    googleDrive.listFilesInFolder.mockResolvedValue([
        { id: '18', name: 'Tilesets' },
        { id: '42', name: 'Decals' }
    ]);

    const result = await assetService.getAssetCategoryContents('stylegrounds');

    expect(result).toBeNull();
});

test('should return category contents', async() => {
    googleDrive.listFilesInFolder.mockResolvedValue([
        { id: '18', name: 'Tilesets' },
        { id: '42', name: 'Decals' }
    ]);

    googleDrive.listFilesInFolderRecursive.mockResolvedValue([
        { id: '88', name: 'bgHousewood', folder: 'Tilesets/BGTilesets/Alex6886' },
        { id: '99', name: 'bgWeatheredBrick', folder: 'Tilesets/FGTilesets/Mosscairn' }
    ]);

    const result = await assetService.getAssetCategoryContents('tilesets');

    expect(result).toStrictEqual(['Tilesets/BGTilesets/Alex6886/bgHousewood', 'Tilesets/FGTilesets/Mosscairn/bgWeatheredBrick']);
    expect(googleDrive.listFilesInFolderRecursive).toHaveBeenCalledWith('18', 'image/png', 'Tilesets');
});

