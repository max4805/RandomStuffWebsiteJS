const axios = require('axios');
const yaml = require('js-yaml');
const memorycache = require('./memorycache');

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
            everestUpdate = await memorycache('everestupdate.yaml', 300000, async() => {
                const everestUpdateYaml = await axios.get(`${process.env.GOOGLE_COMPUTE_BACKEND}/everestupdate.yaml`);
                return yaml.load(everestUpdateYaml.data);
            });
        })(),
        (async() => {
            modSearchDatabase = await memorycache('modsearchdatabase.yaml', 300000, async() => {
                const modSearchDatabaseYaml = await axios.get(`${process.env.GOOGLE_COMPUTE_BACKEND}/modsearchdatabase.yaml`);
                return yaml.load(modSearchDatabaseYaml.data);
            });
        })()
    ]);

    // match mods from both files to get the full info
    return Object.entries(everestUpdate)
        .filter(mod => mod[1].GameBananaType !== 'Mod' || mod[1].GameBananaId !== 53674)
        .map(mod => {
            const matchingMod = modSearchDatabase.filter(one => one.GameBananaType === mod[1].GameBananaType && one.GameBananaId === mod[1].GameBananaId)[0];
            return {
                name: matchingMod.Name,
                id: mod[0],
                url: mod[1].MirrorURL,
                gbLink: `https://gamebanana.com/${mod[1].GameBananaType.toLowerCase()}s/${mod[1].GameBananaId}`
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { getModList };
