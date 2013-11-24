/*
 * Checks to see if this is a git repository
**/
var isRepo = exports.isRepo = function(callback){
	var answer = true;
	this.exec('status', function(err, msg){
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
	var cmd = 'clone ' + repo + ' ' + dir;
	this.exec(cmd, function(){
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

  var opts = ['pull', remote, branch].join(' ');
	this.exec(opts, callback);
};

/*
 * Add files for a commit.
**/
var add = exports.add = function(which, callback){
	var cmd = 'add ' + which;
	this.exec(cmd, callback);
};

/*
 * Commit the repo.
**/
var commit = exports.commit = function(msg, callback){
	var cmd = 'commit -m "' + msg + '"';
	this.exec(cmd, function(){
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

  var opts = ['push', remote, branch].join(' ');
	this.exec(opts, callback);
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
  var cmd = 'log ' + options.join(' ');
  this.exec(cmd, callback);
};
