git-wrapper
===========

a wrapper around the git executable

## Installation

    npm install git-wrapper2

## API

### var git = new Git(options);

Constructor. See [git(1)](http://git-scm.com/docs/git) for available options.

  * `options` Object. Examples: `{ paginate: true }` enables pagination.
    `{ 'git-dir': '../.git' }` specifies a different `.git` directory.

### git.exec(command [[, options], args], callback);

Executes a git command. See [the Git Reference](http://git-scm.com/docs/) for
available commands.

  * `command`   String.         Examples: `'init'`, `'log'`, `'commit'`, etc.
  * `options`   Object.         The options for a git command. E.g.
                                `{ f: true }` to force a command (equivalent
                                to adding `-f` on the command line).
  * `args`      Array[String].  The arguments for a git command. E.g. some
                                files for `git add`.
  * `callback`  Function.       `callback(err, msg)`.

### git.isRepo(callback);

Checks to see if the directory is a git repository. Callback returns a `boolean` indicating whether it is or not.

  * `callback` Function.        `callback(isRepo)`.

### git.clone(repo, dir, callback);

Clones a repository to the destination `dir`.

  * `repo`     String.          Remote repository.
  * `dir`      String.          Local directory to clone into.
  * `cal.back` Function.        `callback(err, msg)`.

### git.pull([remote], [branch], callback)

Performs a `git pull` command against the repository. If `remote` or `branch` are not provided they will default to `origin` and `master` respectively.

  * `remote`   String.          Remote name.
  * `branch`   String.          Branch name to pull.
  * `callback` Function.        `callback(err, msg)`.

## Bugs and Issues

If you encounter any bugs or issues, feel free to email me at matthew at matthewphillips.info.
