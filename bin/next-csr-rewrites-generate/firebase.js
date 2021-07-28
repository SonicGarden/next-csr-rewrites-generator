'use strict';

const { readFileSync, writeFileSync, appendFileSync } = require('fs');
const glob = require('glob');

const isDynamicRoute = (string) => {
  return /\[[^[\]/]+\]/.test(string);
};

const generate = () => {
  const configPath = 'firebase.json';
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const { hosting } = config;
  const { public: hostingPublic, rewrites = [] } = hosting;
  const pattern = `${hostingPublic}/**/*.html`;

  if (!hostingPublic)
    throw new Error(`error: hosting.public attribute is not set in ${configPath}`);

  glob(pattern, (err, files) => {
    if (err) throw new Error(`error: failed to glob. err: ${err}`);

    const targetFiles = files.filter((_) => isDynamicRoute(_));
    const destinations = targetFiles.map((_) => _.replace(hostingPublic, ''));
    const newRewrites = destinations.map((destination) => ({
      source: destination.replace('.html', '').replace(/\[([^[\]/]+)\]/g, ':$1'),
      destination,
    }));
    const mergedRewrites = [
      ...rewrites.filter(({ destination }) => !isDynamicRoute(destination)),
      ...newRewrites,
    ];
    const newConfig = {
      ...config,
      hosting: { ...hosting, rewrites: mergedRewrites, cleanUrls: true },
    };
    writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    appendFileSync(configPath, '\n');
  });
};

module.exports = { generate };
