#!/usr/bin/env node
'use strict';

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const { exit } = require('process');
const { basename } = require('path');
const { description } = require('../../package.json');

// eslint-disable-next-line no-undef
const commandName = basename(__dirname);
const optionDefinitions = [
  {
    name: 'format',
    alias: 'f',
    type: String,
    typeLabel: '{underline firebase}',
    description: 'Format type',
  },
  {
    name: 'output',
    alias: 'o',
    type: String,
    typeLabel: '{underline filepath}',
    description: 'Output file path. (If omitted, the original file will be overwritten)',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Show usage',
  },
];
const options = commandLineArgs(optionDefinitions);
const { format, output, help } = options;
const sections = [
  {
    header: commandName,
    content: description,
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
];
const usage = commandLineUsage(sections);

if (help) {
  console.info(usage);
  exit(0);
}

try {
  if (format !== 'firebase') throw new Error(`error: invalid format. value=${format}`);

  const { generate } = require(`./${format}`);
  await generate(output);
} catch (e) {
  console.error(e.message);
  exit(1);
}
