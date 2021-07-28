#!/usr/bin/env node
'use strict';

const { exit } = require('process');
const { readFileSync, writeFileSync, appendFileSync } = require('fs');
const glob = require('glob');

const errCode = 1;
const configPath = 'firebase.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { hosting } = config;
const { public: hostingPublic, rewrites = [] } = hosting;
const pattern = `${hostingPublic}/**/*.html`;

if (!hostingPublic) {
  console.error(`error: hosting.public attribute is not set in ${configPath}`);
  exit(errCode);
}

glob(pattern, (err, files) => {
  if (err) {
    console.error('error: failed to glob. err:', err);
    exit(errCode);
  }

  const targetFiles = files.filter((_) => /\[[^[\]/]+\]/.test(_));
  const destinations = targetFiles.map((_) => _.replace(hostingPublic, ''));
  const newRewrites = destinations.map((destination) => ({
    source: destination.replace('.html', '').replace(/\[([^[\]/]+)\]/g, ':$1'),
    destination,
  }));
  const mergedRewrites = newRewrites.reduce(
    (acc, cur) => (acc.some((_) => _.source === cur.source) ? acc : [...acc, cur]),
    rewrites
  );
  const newConfig = {
    ...config,
    hosting: { ...hosting, rewrites: mergedRewrites, cleanUrls: true },
  };
  writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
  appendFileSync(configPath, '\n');
});
