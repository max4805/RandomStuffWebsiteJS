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
                    '  PageURL: https://gamebanana.com/mods/53654\n' +
                    '  Name: Wobble Decals\n' +
                    '  Author: JaThePlayer\n' +
                    '  Description: \'\'\n' +
                    '  Likes: 3\n' +
                    '  Views: 3373\n' +
                    '  Downloads: 56\n' +
                    '  Text: This small code mod allows mod makers to easily make their custom decals "wobble"\n' +
                    '  CreatedDate: 5151818\n' +
                    '  Screenshots: ["1"]\n' +
                    '  MirroredScreenshots: ["m1"]\n' +
                    '  CategoryId: 4632\n' +
                    '  CategoryName: Other/Misc\n' +
                    '  Files:\n' +
                    '    - {Description: \'\', HasEverestYaml: true, Size: 1005519, CreatedDate: 1567521581,\n' +
                    '      Downloads: 57, URL: \'https://gamebanana.com/dl/430826\', Name: wobbledecals.zip}\n' +
                    '  Featured:\n' +
                    '    Category: today\n' +
                    '    Position: 0\n' +
                    '- GameBananaType: Skin\n' +
                    '  GameBananaId: 171934\n' +
                    '  PageURL: https://gamebanana.com/skins/171934\n' +
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
                    '  MirroredScreenshots: ["m2"]\n' +
                    '- GameBananaType: Map\n' +
                    '  GameBananaId: 200736\n' +
                    '  PageURL: https://gamebanana.com/maps/200736\n' +
                    '  Name: Super Ogmo Boy remake\n' +
                    '  Author: minecraftgamerpc64\n' +
                    '  Description: \'\'\n' +
                    '  Likes: 1\n' +
                    '  Views: 2102\n' +
                    '  Downloads: 53\n' +
                    '  CreatedDate: 5151820\n' +
                    '  Screenshots: ["3"]\n' +
                    '  MirroredScreenshots: ["m3"]\n' +
                    '  Text: super ogmo boy was made by minecraftgamerpc64 go play it https://minecraftgamerpc66.itch.io/super-ogmo-boy\n' +
                    '  Files:\n' +
                    '    - {Description: \'h\', HasEverestYaml: true, Size: 21132, CreatedDate: 1531484704,\n' +
                    '      Downloads: 53, URL: \'https://gamebanana.com/dl/389157\', Name: ogm_boy_0ce8e.zip}\n'
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
            screenshots: ['m3'],
            files: {'super ogmo boy': {
                url: 'https://celestemodupdater.0x0a.de/banana-mirror/389157.zip',
                name: 'ogm_boy_0ce8e.zip',
                size: 21132,
                createdDate: 1531484704,
                description: 'h',
                order: 0
            }},
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
            screenshots: ['m1'],
            files: {'WobbleDecals': {
                url: 'https://celestemodupdater.0x0a.de/banana-mirror/430826.zip',
                name: 'wobbledecals.zip',
                size: 1005519,
                createdDate: 1567521581,
                description: '',
                order: 0
            }},
            gbLink: 'https://gamebanana.com/mods/53654',
            featured: 'today'
        }
    ]);
});
