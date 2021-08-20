const axios = require('axios');
const mods = require('../services/mods');

jest.mock('axios');

test('should return mod list', async() => {
    axios.get.mockImplementation(url => {
        switch (url) {
        case 'https://max480-random-stuff.appspot.com/celeste/everest_update.yaml':
            return Promise.resolve({
                data:
                    'super ogmo boy:\n' +
                    '  URL: https://celestemodupdater.0x0a.de/banana-mirror/389157.zip\n' +
                    '  GameBananaType: Map\n' +
                    '  Version: NoVersion\n' +
                    '  LastUpdate: 1531484704\n' +
                    '  GameBananaId: 200736\n' +
                    '  xxHash: [1a3dfff696299862]\n' +
                    '  MirrorURL: https://gamebanana.com/mmdl/389157\n' +
                    'WobbleDecals:\n' +
                    '  URL: https://celestemodupdater.0x0a.de/banana-mirror/430826.zip\n' +
                    '  GameBananaType: Mod\n' +
                    '  Version: 1.0.0\n' +
                    '  LastUpdate: 1567521581\n' +
                    '  GameBananaId: 53654\n' +
                    '  xxHash: [49ec0c58414c99ea]\n' +
                    '  MirrorURL: https://gamebanana.com/mmdl/430826'
            });
        case 'https://max480-random-stuff.appspot.com/celeste/mod_search_database.yaml':
            return Promise.resolve({
                data:
                    '- GameBananaType: Mod\n' +
                    '  GameBananaId: 53654\n' +
                    '  Name: Wobble Decals\n' +
                    '  Author: JaThePlayer\n' +
                    '  Description: \'\'\n' +
                    '  Likes: 3\n' +
                    '  Views: 3373\n' +
                    '  Downloads: 56\n' +
                    '  Text: This small code mod allows mod makers to easily make their custom decals "wobble"\n' +
                    '  CreatedDate: 5151818\n' +
                    '  Screenshots: ["1"]\n' +
                    '  CategoryId: 4632\n' +
                    '  CategoryName: Other/Misc\n' +
                    '- GameBananaType: Skin\n' +
                    '  GameBananaId: 171934\n' +
                    '  Name: Prideline\n' +
                    '  Author: IsaGoodFriend\n' +
                    '  Description: \'\'\n' +
                    '  Likes: 14\n' +
                    '  Views: 28859\n' +
                    '  Downloads: 671\n' +
                    '  Text: \'Prideline is a hair color mod. It allows you to change Madeline\'\'s hair color\n' +
                    '    088018 0808F9 86087D\'\n' +
                    '  CreatedDate: 5151819\n' +
                    '  Screenshots: ["2"]\n' +
                    '- GameBananaType: Map\n' +
                    '  GameBananaId: 200736\n' +
                    '  Name: Super Ogmo Boy remake\n' +
                    '  Author: minecraftgamerpc64\n' +
                    '  Description: \'\'\n' +
                    '  Likes: 1\n' +
                    '  Views: 2102\n' +
                    '  Downloads: 53\n' +
                    '  CreatedDate: 5151820\n' +
                    '  Screenshots: ["3"]\n' +
                    '  Text: super ogmo boy was made by minecraftgamerpc64 go play it https://minecraftgamerpc66.itch.io/super-ogmo-boy\n'
            }
            );
        default:
            return Promise.reject();
        }
    });

    const list = await mods.getModList();

    expect(list).toStrictEqual([
        {
            name: 'Super Ogmo Boy remake',
            author: 'minecraftgamerpc64',
            description: '',
            likes: 1,
            views: 2102,
            downloads: 53,
            text: 'super ogmo boy was made by minecraftgamerpc64 go play it https://minecraftgamerpc66.itch.io/super-ogmo-boy',
            createdDate: 5151820,
            screenshots: ['3'],
            files: {'super ogmo boy': 'https://celestemodupdater.0x0a.de/banana-mirror/389157.zip'},
            gbLink: 'https://gamebanana.com/maps/200736'
        },
        {
            name: 'Wobble Decals',
            author: 'JaThePlayer',
            description: '',
            likes: 3,
            views: 3373,
            downloads: 56,
            text: 'This small code mod allows mod makers to easily make their custom decals "wobble"',
            createdDate: 5151818,
            screenshots: ['1'],
            files: {'WobbleDecals': 'https://celestemodupdater.0x0a.de/banana-mirror/430826.zip'},
            gbLink: 'https://gamebanana.com/mods/53654'
        }
    ]);
});
