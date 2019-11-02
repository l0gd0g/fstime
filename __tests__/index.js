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
  beforeAll(() => {
    fs.writeFileSync(ctx.pathToFile, 'example text...');
  });

  it('#set stats file', () => {
    fstime.utimesSync(ctx.pathToFile, ctx.statsSet.atime, ctx.statsSet.mtime);
  });

  it('#read stats file', () => {
    let statsGet = fstime.statSync(ctx.pathToFile);

    expect(ctx.statsSet).toEqual({
      atime: `${statsGet.atime}`,
      mtime: statsGet.mtime,
    });
  });

  afterAll(() => {
    fs.unlinkSync(ctx.pathToFile);
  });
});

it('should throw error if file not exist', () => {
  try {
    fstime.utimesSync('notExistFile.txt', ctx.statsSet.atime, ctx.statsSet.mtime);
  } catch (err) {
    expect(err.name).toBe('TypeError');
    expect(err.message).toBe('Wrong file stat: notExistFile.txt');
  }
});
