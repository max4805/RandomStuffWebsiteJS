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
                .forEach(entry => files[entry[0]] = entry[1].URL);

            return {
                name: mod.Name,
                author: mod.Author,
                description: mod.Description,
                likes: mod.Likes,
                views: mod.Views,
                downloads: mod.Downloads,
                text: mod.Text,
                createdDate: mod.CreatedDate,
                screenshots: mod.Screenshots,
                files: files,
                gbLink: `https://gamebanana.com/${mod.GameBananaType.toLowerCase()}s/${mod.GameBananaId}`
            };
        })
        .filter(a => Object.keys(a.files).length !== 0)
        .sort((a, b) => b.createdDate - a.createdDate);
}

module.exports = { getModList };
