const axios = require('axios');
const mods = require('../services/mods');

jest.mock('axios');

test('should return mod list', async() => {
    axios.get.mockImplementation(url => {
        switch (url) {
        case 'https://backend.com/everestupdate.yaml':
            return Promise.resolve({
                data:
                    'super ogmo boy:\n' +
                    '  MirrorURL: https://celestemodupdater.0x0a.de/banana-mirror/389157.zip\n' +
                    '  GameBananaType: Map\n' +
                    '  Version: NoVersion\n' +
                    '  LastUpdate: 1531484704\n' +
                    '  GameBananaId: 200736\n' +
                    '  xxHash: [1a3dfff696299862]\n' +
                    '  URL: https://gamebanana.com/mmdl/389157\n' +
                    'WobbleDecals:\n' +
                    '  MirrorURL: https://celestemodupdater.0x0a.de/banana-mirror/430826.zip\n' +
                    '  GameBananaType: Mod\n' +
                    '  Version: 1.0.0\n' +
                    '  LastUpdate: 1567521581\n' +
                    '  GameBananaId: 53654\n' +
                    '  xxHash: [49ec0c58414c99ea]\n' +
                    '  URL: https://gamebanana.com/mmdl/430826'
            });
        case 'https://backend.com/modsearchdatabase.yaml':
            return Promise.resolve({
                data:
                    '- GameBananaType: Mod\n' +
                    '  GameBananaId: 53654\n' +
                    '  Name: Wobble Decals\n' +
                    '  Authors: [JaThePlayer]\n' +
                    '  Description: \'\'\n' +
                    '  Likes: 3\n' +
                    '  Views: 3373\n' +
                    '  Downloads: 56\n' +
                    '  Text: This small code mod allows mod makers to easily make their custom decals "wobble"\n' +
                    '    (just like grass, for example). To use, the path to your decal needs to contain\n' +
                    '    a "wobbleDecals" (case sensitive) subfolder. That\'s it!\n' +
                    '  CategoryId: 4632\n' +
                    '  CategoryName: Other/Misc\n' +
                    '- GameBananaType: Skin\n' +
                    '  GameBananaId: 171934\n' +
                    '  Name: Prideline\n' +
                    '  Authors: [IsaGoodFriend]\n' +
                    '  Description: \'\'\n' +
                    '  Likes: 14\n' +
                    '  Views: 28859\n' +
                    '  Downloads: 671\n' +
                    '  Text: \'Prideline is a hair color mod. It allows you to change Madeline\'\'s hair color\n' +
                    '    to any number of pride flags, including custom colors! Custom flag files are a\n' +
                    '    text file with the ".flag" extention. Each line is a new color, (running from\n' +
                    '    top to bottom) going from the top of Maddy\'\'s head to the end of her hair. Custom\n' +
                    '    flags are stored in \'\'Saves/Prideline\'\'. NOTE: If you had custom flags before\n' +
                    '    1.15, they won\'\'t be read until they\'\'re moved. Example: FF0018 FF852C FFFF41\n' +
                    '    088018 0808F9 86087D\'\n' +
                    '- GameBananaType: Map\n' +
                    '  GameBananaId: 200736\n' +
                    '  Name: Super Ogmo Boy remake\n' +
                    '  Authors: [minecraftgamerpc64, Bowling]\n' +
                    '  Description: \'\'\n' +
                    '  Likes: 1\n' +
                    '  Views: 2102\n' +
                    '  Downloads: 53\n' +
                    '  Text: super ogmo boy was made by minecraftgamerpc64 go play it https://minecraftgamerpc66.itch.io/super-ogmo-boy\n' +
                    '    this is a shitpost level and itll take 30 seconds at best, so if youre looking\n' +
                    '    for actual gameplay youre at the wrong place. special thanks to minecraftgamerpc\n' +
                    '    giving me the assets of the game for this remake.'
            }
            );
        default:
            return Promise.reject();
        }
    });

    process.env.GOOGLE_COMPUTE_BACKEND = 'https://backend.com';

    const list = await mods.getModList();

    expect(list).toStrictEqual([
        {
            name: 'Super Ogmo Boy remake',
            id: 'super ogmo boy',
            url: 'https://celestemodupdater.0x0a.de/banana-mirror/389157.zip',
            gbLink: 'https://gamebanana.com/maps/200736'
        },
        {
            name: 'Wobble Decals',
            id: 'WobbleDecals',
            url: 'https://celestemodupdater.0x0a.de/banana-mirror/430826.zip',
            gbLink: 'https://gamebanana.com/mods/53654'
        }
    ]);
});
