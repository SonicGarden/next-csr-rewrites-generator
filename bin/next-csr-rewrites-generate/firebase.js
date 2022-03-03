'use strict';

const { readFileSync, writeFileSync, appendFileSync } = require('fs');
const glob = require('glob');

const ORIGINAL_PATH = 'firebase.json';

const isDynamicRoute = (string) => {
  return /\[[^[\]/]+\]/.test(string);
};

const generateHosting = async (inputHostingConfig) => {
  const { public: hostingPublic, rewrites = [] } = inputHostingConfig;
  const pattern = `${hostingPublic}/**/*.html`;

  if (!hostingPublic)
    throw new Error('error: hosting.public attribute is not set in the input file');

  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) reject(`error: failed to glob. err: ${err}`);

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

      resolve({ ...inputHostingConfig, rewrites: mergedRewrites, cleanUrls: true });
    });
  });
};

const generate = async (outputPath = ORIGINAL_PATH, inputPath = ORIGINAL_PATH) => {
  const config = JSON.parse(readFileSync(inputPath, 'utf8'));
  const { hosting } = config;
  const newHosting = Array.isArray(hosting)
    ? await Promise.all(hosting.map((_) => generateHosting(_)))
    : await generateHosting(hosting);
  const newConfig = {
    ...config,
    hosting: newHosting,
  };

  console.info('=== before generating ===');
  console.info('hosting:', JSON.stringify(hosting, null, 2));
  console.info('=== after generating ===');
  console.info('hosting:', JSON.stringify(newHosting, null, 2));
  console.info('');
  writeFileSync(outputPath, JSON.stringify(newConfig, null, 2));
  appendFileSync(outputPath, '\n');
  console.info('generated!');
};

module.exports = { generate };
