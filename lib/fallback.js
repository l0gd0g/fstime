// fallback on non-linux platform
const { utimesSync, statSync } = require('fs');

module.exports = {
  utimesSync(filepath, atime, mtime) {
    if (!['string', 'number'].includes(typeof atime)) {
      throw new TypeError('atime invalid type - only string and number allowed');
    }

    if (!['string', 'number'].includes(typeof mtime)) {
      throw new TypeError('mtime invalid type - only string and number allowed');
    }

    try {
      // At MacOS and Win time arguments require seconds, but in linux allowed
      utimesSync(filepath, parseFloat(atime) / 1000, parseFloat(mtime) / 1000);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new TypeError(`Wrong file stat: ${filepath}`);
      }

      throw err;
    }
  },
  statSync(filepath) {
    const stat = statSync(filepath);

    return {
      ...stat,
      atime: stat.atimeMs.toFixed(6),
      mtime: stat.mtimeMs.toFixed(6),
      ctime: stat.mtimeMs.toFixed(6),
      // remove field don't supported in native part
      atimeMs: undefined,
      mtimeMs: undefined,
      ctimeMs: undefined,
      birthtimeMs: undefined,
      birthtime: undefined,
    };
  },
};
