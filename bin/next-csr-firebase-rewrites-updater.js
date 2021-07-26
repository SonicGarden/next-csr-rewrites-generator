#!/usr/bin/env node
'use strict';

const fs = require('fs');
const glob = require('glob');

const configPath = 'firebase.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { hosting } = config;
const { public: hostingPublic, rewrites } = hosting;
const pattern = `${hostingPublic}/**/*.html`;

glob(pattern, (err, files) => {
  if (err) {
    console.error('failed to glob. err:', err);
    return;
  }

  const targetFiles = files.filter((_) => _.includes('['));
  const destinations = targetFiles.map((_) => _.replace(hostingPublic, ''));
  const newRewrites = destinations.map((_) => ({
    source: _.replace('.html', '').replace('[', ':').replace(']', ''),
    destination: _,
  }));
  const margedRewrites = newRewrites.reduce(
    (acc, cur) => (acc.some((_) => _.source === cur.source) ? acc : [...acc, cur]),
    rewrites
  );
  const newConfig = {
    ...config,
    hosting: { ...hosting, rewrites: margedRewrites, cleanUrls: true },
  };
  fs.writeFileSync('./firebase.json', JSON.stringify(newConfig, null, 2));
  fs.appendFileSync('./firebase.json', '\n');
});
