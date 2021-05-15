#!/usr/bin/env node
const sh = require("shelljs");
const x = sh.exec;

const fs = require('fs');
const path = require('path');
const {program} = require('commander');
const {version} = require('../package.json');
const example = `
    {
      "executable": "./bin/egg.js",
      "options": "",
      "testPrefix": "npx mocha test -g",
      "defaultExtension": ".egg"
    }
    `;
debugger;

const copyRunTest = (programName,  options) => {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(options.config));
  } catch (e) {
    console.error(
`Provide a correct ".make-test.json" file. 
Problems with "${options.config}" config file. 
Example of config file:
${example}
`);
    process.exit(1);
  }
  let {executable, execOptions, testPrefix, defaultExtension, testFolder} = data;

  function error(msg, code) {
    sh.echo(msg);
    sh.exit(code)
  }

  let {dir, root, base, name, ext }  = path.parse(programName);
  let fileName = base;
  console.log(dir, root, fileName, name, ext);

  //if (!programName) error(`Provide the name of the input file`);
  if (ext === "" && defaultExtension) programName += defaultExtension;
  
  if (!x(`${executable} ${execOptions} ${programName}`)) 
    error(`"${executable} ${execOptions} ${programName}" execution failed`)
  
  let redirectCommand = `${executable} ${execOptions} ${programName} > ${testFolder}/${programName}.expected`;
  if(!x(redirectCommand))
    error(`"${redirectCommand}" failed`)
  else console.log(`Executed "${redirectCommand}" succesfully`);
  
  let copyProgramCommand = `cp ${programName} test/${programName}`
  if(!x(copyProgramCommand)) 
    error(`"${copyProgramCommand}" failed`)
  else console.log(`Executed "${copyProgramCommand}" succesfully`);
  
  if (typeof testPrefix !== undefined) {
    let mochaCommand = `${testPrefix} ${fileName}`
    if(!x(mochaCommand)) 
      error(`"${mochaCommand}" failed`)
    else console.log(`Executed "${mochaCommand}" succesfully`);  
  }
  
  sh.ls(`-l`,`test/${programName}*`).forEach(f => {
      console.log(f.name);
  })  
}

program
    .version(version)
    .option('-c --config <configFileName.json>', `Name of the JSON configuration file. Here is an example of config file:${example}`, './.make-test.json')
    .arguments('<programName>')
    .action(copyRunTest);

program.parse(process.argv);

