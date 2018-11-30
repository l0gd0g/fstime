'use strict';

const assert = require('assert');
const fs = require('fs');
const fstime = require('../lib');

describe('Set and read time modify and time access for file', function() {
  const pathToFile = 'testFile.tmp';
  let time = new Date().getTime();
  const statsSet = {
    atime: time, // or change on '.123456'
    mtime: time + '.493406', // -> 1496671445880.493406
  };

  it('#set and read stats file', function() {
    let fd = fs.openSync(pathToFile, 'w');

    fs.writeSync(fd, 'example text...');

    fstime.utimesSync(pathToFile, statsSet.atime, statsSet.mtime);

    let statsGet = fstime.statSync(pathToFile);

    assert.deepEqual(statsSet, {
      atime: statsGet.atime,
      mtime: statsGet.mtime,
    });

    fs.closeSync(fd);

    fs.unlinkSync(pathToFile);
  });

  it('should throw error if file not exist', function() {
    try {
      fstime.utimesSync('notExistFile.txt', statsSet.atime, statsSet.mtime);
    } catch (err) {
      assert(err.name === 'TypeError');
      assert(err.message === 'Wrong file stat: notExistFile.txt');
    }
  });
});
