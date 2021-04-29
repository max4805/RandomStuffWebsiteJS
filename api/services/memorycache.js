const _ = require('lodash');

const cached = {};
const cachedExpirations = {};

/**
 * Calls a function and caches its result, or just returns the result if it is already in cache.
 * @param {String} key An identifier that will be used as a cache key
 * @param {Number} expiration The expiration delay of the cache in milliseconds
 * @param {Function<Object>} func The function which return value is getting cached
 * @returns The result of the function
 */
const memorycache = async(key, expiration, func) => {
    // prune expired cached keys.
    Object.keys(cached)
        .filter(key => cachedExpirations[key] < new Date().getTime())
        .forEach(key => {
            delete cached[key];
            delete cachedExpirations[key];
        });

    // check whether key was already cached.
    if (cached[key] !== undefined) {
        return _.cloneDeep(cached[key]);
    }

    // otherwise, call the function, and cache its result.
    const value = await func();
    cached[key] = value;
    cachedExpirations[key] = new Date().getTime() + expiration;
    return _.cloneDeep(value);
};

module.exports = memorycache;
