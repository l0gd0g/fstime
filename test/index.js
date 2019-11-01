'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const fstime = require('../lib');

let time = new Date().getTime();
const ctx = {
  pathToFile: 'testFile.tmp',
  statsSet: {
    atime: `${time}.123456`,
    mtime: `${time}.493406`, // -> 1496671445880.493406
  },
};

const describeOnlyOnLinux = os.platform() === 'linux' ? describe : describe.skip;

describeOnlyOnLinux('Set and read time modify and time access for file', () => {
  before(() => {
    fs.writeFileSync(ctx.pathToFile, 'example text...');
  });

  it('#set stats file', () => {
    fstime.utimesSync(ctx.pathToFile, ctx.statsSet.atime, ctx.statsSet.mtime);
  });

  it('#read stats file', () => {
    let statsGet = fstime.statSync(ctx.pathToFile);

    assert.deepStrictEqual(ctx.statsSet, {
      atime: `${statsGet.atime}`,
      mtime: statsGet.mtime,
    });
  });

  after(() => {
    fs.unlinkSync(ctx.pathToFile);
  });
});

it('should throw error if file not exist', () => {
  try {
    fstime.utimesSync('notExistFile.txt', ctx.statsSet.atime, ctx.statsSet.mtime);
  } catch (err) {
    assert(err.name === 'TypeError');
    assert(err.message === 'Wrong file stat: notExistFile.txt');
  }
});
