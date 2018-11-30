const fstime = require('../build/Release/fstime');

module.exports = function utimesSync(pathToFile, atime_nsec, mtime_nsec) {
  atime_nsec = atime_nsec.toString().replace('.', '');
  mtime_nsec = mtime_nsec.toString().replace('.', '');
  try {
    return fstime.utimesSync(
      pathToFile,
      parseInt(atime_nsec.substr(0, 10)), // atime_sec
      parseInt(atime_nsec.substr(10, 9)) || 0, // atime_nsec 880493406
      parseInt(mtime_nsec.substr(0, 10)), // mtime_sec
      parseInt(mtime_nsec.substr(10, 9)) || 0, // mtime_nsec 880493406
    );
  } catch (err) {
    err.message = err.message + `: ${pathToFile}`;
    throw err;
  }
};
