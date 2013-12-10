#!/usr/bin/env node

var program = require('commander');
var exec = require('child_process').exec;

var child;

var run = function(cmd){
  child = exec(cmd, function (error, stdout, stderr) {
    if (stderr !== null) {
      console.log('stderr:\n' + stderr);
    }
    if (stdout !== null) {
      console.log('stdput:\n' + stdout);
    }
    if (error !== null) {
      console.log('error:\n' + error);
    }
  });
};

program
  .version('0.1.3')
  .option('i, --install ', 'install packages')
  .parse(process.argv);



if (program.install) {
  run('npm install');
}


var count = 0;


// If parameter is missing or not supported, display help
program.options.filter(function (option) {
  if(!(option.short == process.argv[2]))
    count++
});

if(count == program.options.length)
  program.help();