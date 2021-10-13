const axios = require('axios');
const yaml = require('js-yaml');

/**
 * Retrieves the info on all mods that are present in everest_update.yaml (and as such, on Banana Mirror).
 * @returns {Object[]} An array, sorted by name, with all mods in everest_update.yaml. Each has the following fields: id, name, url, gbLink
 */
const getModList = async() => {
    let everestUpdate;
    let modSearchDatabase;

    // load all info from both files at the same time
    await Promise.all([
        (async() => {
            const everestUpdateYaml = await axios.get('https://max480-random-stuff.appspot.com/celeste/everest_update.yaml');
            everestUpdate = yaml.load(everestUpdateYaml.data);
        })(),
        (async() => {
            const modSearchDatabaseYaml = await axios.get('https://max480-random-stuff.appspot.com/celeste/mod_search_database.yaml');
            modSearchDatabase = yaml.load(modSearchDatabaseYaml.data);
        })()
    ]);

    // match mods from both files to get the full info
    return modSearchDatabase
        .map(mod => {
            const files = {};
            Object.entries(everestUpdate)
                .filter(entry => entry[1].GameBananaType === mod.GameBananaType && entry[1].GameBananaId === mod.GameBananaId)
                .forEach(entry => {
                    // find the matching file in the mod search database to get the full info.
                    const bananaUrl = entry[1].MirrorURL.replace('/mmdl/', '/dl/');
                    const info = mod.Files.filter(file => file.URL === bananaUrl).map(file => ({
                        createdDate: file.CreatedDate,
                        size: file.Size,
                        name: file.Name,
                        url: entry[1].URL,
                        description: file.Description,
                        order: mod.Files.indexOf(file)
                    }))[0];
                    files[entry[0]] = info;
                });

            const result = {
                name: mod.Name,
                author: mod.Author,
                description: mod.Description,
                likes: mod.Likes,
                views: mod.Views,
                downloads: mod.Downloads,
                text: mod.Text,
                createdDate: mod.CreatedDate,
                screenshots: mod.MirroredScreenshots,
                files: files,
                gbLink: mod.PageURL
            };

            if (mod.Featured) {
                result.featured = mod.Featured.Category;
            }

            return result;
        })
        .filter(a => Object.keys(a.files).length !== 0)
        .sort((a, b) => b.createdDate - a.createdDate);
}

module.exports = { getModList };
