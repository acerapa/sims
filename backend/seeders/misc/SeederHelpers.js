const Seeder = require("../../models/misc/seeders");
const fs = require("fs");
const { dirname } = require("path");

const seederCachePath = dirname(__dirname) + "/cache/seeder.json";

/**
 * Will check if a seeder has been executed
 * therefore preventing the seeder from being executed again
 *
 * @param {*} seeder_name string
 * @returns boolean
 */
const checkIfSeederExecuted = async (seeder_name) => {
  let cache = [];
  if (isCacheExist()) {
    cache = extractCache();
  } else {
    // create the cache file
    fs.writeFileSync(seederCachePath, JSON.stringify([]));
  }

  if (!cache.length) {
    const seeders = await Seeder.findAll({ attributes: ["name", "data"] });

    // after getting all the seeders from the database
    // we will save the seeders to the cache
    if (seeders.length) {
      cache = seeders;
      fs.writeFileSync(seederCachePath, JSON.stringify(cache));
    }
  }

  // check if the seeder has been executed
  return cache.map((s) => s.name).includes(seeder_name);
};

const registerSeederExecution = async (
  seeder_name,
  data,
  isChecked = false
) => {
  // check if the seeder has been executed
  let isExecuted = false;
  if (!isChecked) {
    isExecuted = await checkIfSeederExecuted(seeder_name);
  }

  if (!isExecuted) {
    // if the seeder has not been executed
    // we will create a new seeder
    const seeder = await Seeder.create({ name: seeder_name, data: data });

    // update the cache
    const cache = extractCache();
    cache.push({ name: seeder_name, data: data });

    fs.writeFileSync(seederCachePath, JSON.stringify(cache));

    return seeder;
  }
};

const removeSeederExecution = async (seeder_name) => {
  // check if the seeder has been executed
  const isExecuted = await checkIfSeederExecuted(seeder_name);
  if (isExecuted) {
    // if the seeder has been executed
    // we will remove the seeder
    const seeder = await Seeder.findOne({ where: { name: seeder_name } });
    if (seeder) await seeder.destroy();

    // update the cache
    const cache = extractCache();
    const index = cache.findIndex((s) => s.name === seeder_name);
    if (index > -1) {
      cache.splice(index, 1);
      fs.writeFileSync(seederCachePath, JSON.stringify(cache));
    }

    return seeder;
  }
};

const getSeederExecution = async (seeder_name) => {
  // check if the seeder is in cache
  const cache = extractCache();
  let seeder = null;
  const seedIndex = cache.findIndex((s) => s.name === seeder_name);
  if (seedIndex > -1) {
    seeder = cache[seedIndex];
  } else {
    seeder = await Seeder.findOne({
      where: { name: seeder_name },
      attributes: ["name", "data"],
    });

    if (seeder) {
      cache.push(seeder);
      fs.writeFileSync(seederCachePath, JSON.stringify(cache));
    }
  }

  return seeder;
};

/** *****************************
 * Private functions
 ******************************** */
const isCacheExist = () => {
  return fs.existsSync(seederCachePath);
};

const extractCache = () => {
  const data = fs.readFileSync(seederCachePath);
  let cache = [];
  if (!data.toString()) {
    console.log("No cache found");
  } else {
    cache = JSON.parse(data);
  }

  return cache;
};

module.exports = {
  checkIfSeederExecuted,
  registerSeederExecution,
  removeSeederExecution,
  getSeederExecution,
};
