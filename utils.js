var fs = require('fs');

/*
* Ensure that the repository exists.
**/
var ensureExists = exports.ensureExists = function(gitDir, callback){
 fs.exists(gitDir, function(exists){
   if(!exists){
     return fs.mkdir(gitDir, function(err){
       callback(err || void 0);
     });
   }
   callback();
 });
};

/*
 * This function ensures that we are operating out
 * of the proper directory when making git calls.
**/
exports.setDir = function(gitDir, callback){
	return function(){
		var self = this, args = arguments;

		ensureExists(gitDir, function(){
			process.chdir(gitDir);
			callback.apply(self, args);
		});
	};
};
