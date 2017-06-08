'use strict';

const fstime = require('../build/Release/fstime');

module.exports = {
	
	/**
	 * Get object fs.stats
	 * @param pathToFile
	 * @return {*}
	 */
	statSync: (pathToFile) => {
		let stats = fstime.statsSync(pathToFile);
		
		stats.atime = `${stats.atime_sec}${stats.atime_nsec.toString().substr(0, 3)}.${stats.atime_nsec.toString().substr(3, 6) || 0}`;
		stats.mtime = `${stats.mtime_sec}${stats.atime_nsec.toString().substr(0, 3)}.${stats.mtime_nsec.toString().substr(3, 6) || 0}`;
		stats.ctime = `${stats.ctime_sec}${stats.atime_nsec.toString().substr(0, 3)}.${stats.ctime_nsec.toString().substr(3, 6) || 0}`;
		
		delete stats.atime_sec;
		delete stats.atime_nsec;
		
		delete stats.mtime_sec;
		delete stats.mtime_nsec;
		
		delete stats.ctime_sec;
		delete stats.ctime_nsec;
		
		return stats;
	},
	
	/**
	 * Set access time to file, and modify time to file
	 * @param pathToFile
	 * @param atime_nsec - access time (example: 1496671445880.493406 or 1496671445880493406)
	 * @param mtime_nsec - modify time (example: 1496671445880.493406 or 1496671445880493406) 
	 * @return {*}
	 */
	utimesSync: (pathToFile, atime_nsec, mtime_nsec) => {
		
		atime_nsec = atime_nsec.toString().replace('.', '');
		mtime_nsec = mtime_nsec.toString().replace('.', '');
		try {
			return fstime.utimesSync(
				pathToFile,
				parseInt(atime_nsec.substr(0, 10)),      // atime_sec
				parseInt(atime_nsec.substr(10, 9)) || 0, // atime_nsec 880493406
				parseInt(mtime_nsec.substr(0, 10)),      // mtime_sec 
				parseInt(mtime_nsec.substr(10, 9)) || 0  // mtime_nsec 880493406
			);
		} catch (err) {
			err.message = err.message + `: ${pathToFile}`;
			throw err;
		}
	}
};
