# fstime

## Install

    $ npm install fstime

## Examples

	const fstime = require('fstime');
	
	fstime.utimesSync(pathToFile, 1496671445880.493406, 1496671445880.493406);
	
	//1496671445880.493406: 
	//	1496671445880 - milliseconds
	//	493406 - nano part
	
	// or this example :
	fstime.utimesSync(pathToFile, 1496671445880493406, 1496671445880493406);
	
	let stats = fstime.statsSync(pathToFile);
	
	// stats Object fs.Stats

## Tests

	$ npm install
	$ npm test

## Credits

  - [Maxim Jarusov](http://github.com/l0gd0g)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Maxim Jarusov
