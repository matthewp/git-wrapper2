// imports
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var commands = require('./commands');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var setDir = require('./utils').setDir;

// Class Git
var Git = module.exports = function (options) {
  this.binary = 'git';
  options = options || {};

  // if a gitDir is provided, make sure we are chdir-ed into
  // the directory before performing git operations.
  var gitDir = options['git-dir'];
  if(gitDir) {
    var dir = path.dirname(gitDir);
    var exec = this.exec.bind(this);
    this.exec = function(command){
      var self = this, args = arguments;
      if(command.indexOf('clone') === 0) {
        return exec.apply(self, args);
      }

      setDir(dir, function(){
        exec.apply(self, args);
      });
    };
  }

  this.args = Git.optionsToString(options);
};

inherits(Git, EventEmitter);

// git.exec(command [[, options], args ], callback)
Git.prototype.exec = function (command, options, args, callback) {
  callback = arguments[arguments.length - 1];

  if (arguments.length == 2) {
    options = {};
    args = [];
  } else if (arguments.length == 3) {
    args = arguments[1];
    options = [];
  }

  args = args.join(' ');
  options = Git.optionsToString(options)

  var cmd = this.binary + ' ' + this.args + ' ' + command + ' ' + options + ' '
    + args;

  exec(cmd, function (err, stdout, stderr) {
    callback(err, stdout);
  });
};

// converts an object that contains key value pairs to a argv string
Git.optionsToString = function (options) {
  var args = [];

  for (var k in options) {
    var val = options[k];

    if (k.length == 1) {
      // val is true, add '-k'
      if (val === true)
        args.push('-'+k);
      // if val is not false, add '-k val'
      else if (val !== false)
        args.push('-'+k+' '+val);
    } else {
      if (val === true)
        args.push('--'+k);
      else if (val !== false)
        args.push('--'+k+'='+val);
    }
  }

  return args.join(' ');
};

Object.keys(commands).forEach(function(key) {
  Git.prototype[key] = commands[key];
});
