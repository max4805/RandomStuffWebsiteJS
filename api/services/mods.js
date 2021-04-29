const axios = require('axios');
const yaml = require('js-yaml');
const memorycache = require('./memorycache');

const getModList = async() => {
    // load all info
    let everestUpdate;
    let modSearchDatabase;

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

    // match mods from both files
    return Object.entries(everestUpdate)
        .map(mod => {
            const matchingMod = modSearchDatabase.filter(one => one.GameBananaType === mod[1].GameBananaType && one.GameBananaId === mod[1].GameBananaId)[0];
            return {
                name: matchingMod.Name,
                id: mod[0],
                url: mod[1].MirrorURL
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { getModList };
