const fs = require('fs');
const os = require('os');
const fstime = require('../lib');

describe('fstime', () => {
  const time = new Date().getTime();
  const ctx = {
    pathToFile: 'testFile.tmp',
    cyrillicPathToFile: 'тестФайл.tmp',
    badPathToFile: 1,
    statsSet: {
      atime: `${time}.123456`,
      mtime: `${time}.654321`,
    },
    badStatsSet: {
      atime: 'bad',
      mtime: 'bad',
    },
  };

  describe('File not exist', () => {
    it('statSync', () => {
      try {
        fstime.statSync('notExistFile.txt');
      } catch (err) {
        expect(err.name).toBe('TypeError');
        expect(err.message).toBe('Wrong file stat');
      }
    });

    it('utimesSync', () => {
      try {
        fstime.utimesSync('notExistFile.txt', ctx.statsSet.atime, ctx.statsSet.mtime);
      } catch (err) {
        expect(err.name).toBe('TypeError');
        expect(err.message).toBe('Wrong file stat: notExistFile.txt');
      }
    });
  });

  const describeOnlyOnLinux = os.platform() === 'linux' ? describe : describe.skip;

  describeOnlyOnLinux('Set and read timestamps for file', () => {
    describe('english path', () => {
      beforeAll(() => {
        fs.writeFileSync(ctx.pathToFile, 'example text...');
      });

      it('set stats to file', () => {
        fstime.utimesSync(ctx.pathToFile, ctx.statsSet.atime, ctx.statsSet.mtime);
      });

      it('read stats from file', () => {
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

    describe('cyrillic path', () => {
      beforeAll(() => {
        fs.writeFileSync(ctx.cyrillicPathToFile, 'example text...');
      });

      it('set stats to file', () => {
        fstime.utimesSync(ctx.cyrillicPathToFile, ctx.statsSet.atime, ctx.statsSet.mtime);
      });

      it('read stats from file', () => {
        let statsGet = fstime.statSync(ctx.cyrillicPathToFile);

        expect(ctx.statsSet).toEqual({
          atime: `${statsGet.atime}`,
          mtime: statsGet.mtime,
        });
      });

      afterAll(() => {
        fs.unlinkSync(ctx.cyrillicPathToFile);
      });
    });
  });

  describeOnlyOnLinux('errors', () => {
    describe('wrong path type', () => {
      it('statSync', () => {
        try {
          fstime.statSync(ctx.badPathToFile);
        } catch (err) {
          expect(err.name).toBe('TypeError');
          expect(err.message).toBe('Path must be string value');
        }
      });

      it('utimesSync', () => {
        try {
          fstime.utimesSync(ctx.badPathToFile, ctx.statsSet.atime, ctx.statsSet.mtime);
        } catch (err) {
          expect(err.name).toBe('TypeError');
          expect(err.message).toBe(`Path must be string value: ${ctx.badPathToFile}`);
        }
      });
    });

    describe('utimesSync wrong params', () => {
      beforeAll(() => {
        fs.writeFileSync(ctx.pathToFile, 'example text...');
      });

      it('wrong access time type', () => {
        try {
          fstime.utimesSync(ctx.pathToFile, ctx.badStatsSet.atime, ctx.statsSet.mtime);
        } catch (err) {
          expect(err.name).toBe('TypeError');
          expect(err.message).toBe(`Error on transforming Number: ${ctx.badPathToFile}`);
        }
      });

      it('wrong modification time type', () => {
        try {
          fstime.utimesSync(ctx.pathToFile, ctx.statsSet.atime, ctx.badStatsSet.mtime);
        } catch (err) {
          expect(err.name).toBe('TypeError');
          expect(err.message).toBe(`Error on transforming Number: ${ctx.badPathToFile}`);
        }
      });

      afterAll(() => {
        fs.unlinkSync(ctx.pathToFile);
      });
    });
  });
});
