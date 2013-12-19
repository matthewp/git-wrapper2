var Readable = require('stream').Readable;

/*
 * Checks to see if this is a git repository
**/
var isRepo = exports.isRepo = function(callback){
	var answer = true;
	return this.exec('status', function(err, msg){
		if(err){
			answer = err.toString().indexOf('Not a git repository') === -1;
		}
		callback(answer);
	});
};

/*
 * Clone the repository.
**/
var clone = exports.clone = function(repo, dir, callback){
  var args = [repo, dir];
	return this.exec('clone', args, function(){
    this.emit('clone', repo, dir);
    callback.apply(this, arguments);
  }.bind(this));
};

/*
 * Pull latest from the repository
**/
var pull = exports.pull = function(remote, branch, callback){
  if(typeof remote == 'function') {
    callback = remote;
    remote = 'origin';
    branch = 'master';
  } else if(typeof branch == 'function') {
    callback = branch;
    branch = 'master';
  }

  var args = [remote, branch];
	return this.exec('pull', args, callback);
};

/*
 * Add files for a commit.
**/
var add = exports.add = function(which, callback){
	var cmd = 'add', args = [which];
	return this.exec(cmd, args, callback);
};

/*
 * Remove files for a commit.
**/
var rm = exports.rm = function(which, callback) {
  which = Array.isArray(which) ? which : [which];
  this.exec('rm', which, callback);
};

/*
 * Commit the repo.
**/
var commit = exports.commit = function(msg, callback){
  var args = ['-m', '"' + msg + '"'];
	return this.exec('commit', args, function(){
    this.emit('commit', msg);
    callback.apply(this, arguments);
  }.bind(this));
};

/*
 * Push to master
**/
var push = exports.push = function(remote, branch, callback){
  if(typeof remote == 'function') {
    callback = remote;
    remote = 'origin';
    branch = 'master';
  } else if(typeof branch == 'function') {
    callback = branch;
    branch = 'master';
  }

  var args = [remote, branch];
	return this.exec('push', args, callback);
};

/*
 * Save - Does commit and push at once.
**/
exports.save = function(msg, callback){
	this.add('.', function(err) {
		if(err) return callback(err);

		this.commit(msg, function(err){
			if(err) return callback(err);
			this.push(function(){
        this.emit('saved', msg);
        callback.apply(this, arguments);
      }.bind(this));
		}.bind(this));
	}.bind(this));
};

/*
 * Call `git log`, optionally with arguments
**/
exports.log = function(options, callback) {
  if(typeof options == 'function') {
    callback = options;
    options = [];
  }
  return this.exec('log', options, callback);
};
