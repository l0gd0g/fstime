try {
  module.exports = require('../build/Release/fstime');
} catch (err) {
  const { utimesSync, statSync } = require('fs');
  // fallback on non-linux platform
  module.exports = {
    utimesSync(filepath, atime, mtime) {
      if (!['string', 'number'].includes(typeof atime)) {
        throw new TypeError('atime invalid type - only string and number allowed');
      }

      if (!['string', 'number'].includes(typeof mtime)) {
        throw new TypeError('mtime invalid type - only string and number allowed');
      }

      utimesSync(filepath, atime, mtime);
    },
    statSync(filepath) {
      const stat = statSync(filepath);

      return {
        ...stat,
        atime: stat.atimeMs.toFixed(6),
        mtime: stat.mtimeMs.toFix(6),
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
}
