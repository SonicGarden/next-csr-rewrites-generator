#!/usr/bin/env node
'use strict';

const commandLineArgs = require('command-line-args');
const { exit } = require('process');

const optionDefinitions = [{ name: 'format', type: String }];
const options = commandLineArgs(optionDefinitions);
const { format } = options;

try {
  const { generate } = require(`./${format}`);
  generate();
} catch (e) {
  console.error(e);
  exit(1);
}
