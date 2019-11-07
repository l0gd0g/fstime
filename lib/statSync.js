const fstime = require('../build/Release/fstime');

module.exports = function getStatSync(pathToFile) {
  const stats = fstime.statSync(pathToFile);

  stats.atime = `${stats.atime_sec}${stats.atime_nsec
    .toString()
    .substr(0, 3)}.${stats.atime_nsec.toString().substr(3, 6) || 0}`;
  stats.mtime = `${stats.mtime_sec}${stats.atime_nsec
    .toString()
    .substr(0, 3)}.${stats.mtime_nsec.toString().substr(3, 6) || 0}`;
  stats.ctime = `${stats.ctime_sec}${stats.atime_nsec
    .toString()
    .substr(0, 3)}.${stats.ctime_nsec.toString().substr(3, 6) || 0}`;

  delete stats.atime_sec;
  delete stats.atime_nsec;

  delete stats.mtime_sec;
  delete stats.mtime_nsec;

  delete stats.ctime_sec;
  delete stats.ctime_nsec;

  return stats;
};
