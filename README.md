# metalsmith-move-up
[![travis][travis-badge]][travis-url]
[![git][git-badge]][git-url]
[![npm][npm-badge]][npm-url]
[![standard][standard-badge]][standard-url]
[![nearform][nearform-badge]][nearform-url]

__metalsmith-move-up__ is a [MetalSmith][] plugin for moving the full contents of a directory up one or more
levels. By default this plugin will move everything in your destination directory up one. __metalsmith-move-up__
Supports multiple patterns, which will be processed in the order they are provided, allowing for more complex
transforms to be done with a single call.

For globbing support we use [multimatch][], which itself is based on [minimatch][]. To make matching easier
we set dot matching to true meaning a global match can be done using a single globstar `**`.

## Installation
To install __metalsmith-move-up__, simply use npm:

```
npm install metalsmith-move-up --save
```

## Usage
The example below can be found and ran from the [examples](./examples/) folder; it demonstrates
how to use __metalsmith-move-up__ in a couple of different ways in a node.js app.

```javascript
'use strict'

var metalsmith = require('metalsmith'),
    moveUp = require('metalsmith-move-up')

// move everything in the build folder up one. The
// build folder always represents the root for operations.
metalsmith.use(moveUp())

// globbing is supported via minimatch. The by count
// moves everything N or as many times as possible. This
// means if a given match only has one path part, it
// will only be moved up one directory.
metalsmith.use(moveUp({
  pattern: 'pages/*',
  by: 2
}))

// combination rules are supported to help with filtering
// more specifically. Simply use an array of glob strings.
metalsmith.use(moveUp({
  pattern: ['pages/*', '!*.css'],
  by: 1
}))

// multiple, order specific, transforms can be done with one
// call. Each job only begins after the previous one finishes.
metalsmith.use(moveUp(
    {pattern: ['pages/docs/*', '!*.css'], by: 1},
    {pattern: 'docs/feature.html', by: 1}
))
```

__Note:__ _In the case of multiple patterns, each pattern is passed as another param, there is no need to
wrap them further._

### Options
The options object has two fields, if no options are passed a default pattern will be ran that pulls
all applicable files and folders in the build directory up by one.

##### _pattern_
The glob pattern to use when locating files and directories for moving, can be a string or an array of
strings. see both [multimatch][] and [minimatch][] for example patterns.

##### _by_
The maximum number of path parts to remove. Matches with less path segments than the count will have
all of their segments removed, as such, they will end up in the root (destination) folder.

## Contributing
__metalsmith-move-up__ is an __open project__ and encourages participation. If you feel you can help in
any way, be it with examples, extra testing, or new features please be our guest.

_See our [Contribution Guide][] for information on obtaining the source and an overview of the tooling used._

## License

Copyright Dean McDonnell 2015, Licensed under [MIT](./LICENSE)

[travis-badge]: https://img.shields.io/travis/mcdonnelldean/metalsmith-move-up.svg?style=flat-square
[travis-url]: https://travis-ci.org/mcdonnelldean/metalsmith-move-up
[git-badge]: https://img.shields.io/github/release/mcdonnelldean/metalsmith-move-up.svg?style=flat-square
[git-url]: https://github.com/mcdonnelldean/metalsmith-move-up/releases
[npm-badge]: https://img.shields.io/npm/v/metalsmith-move-up.svg?style=flat-square
[npm-url]: https://npmjs.org/package/metalsmith-move-up
[standard-badge]: https://img.shields.io/badge/code%20style-standard-blue.svg?style=flat-square
[standard-url]: https://npmjs.org/package/standard
[nearform-badge]: https://img.shields.io/badge/sponsored%20by-nearForm-red.svg?style=flat-square
[nearform-url]: http://nearform.com
[Metalsmith]: http://metalsmith.io
[MultiMatch]: https://www.npmjs.com/package/minimatch
[MiniMatch]: https://www.npmjs.com/package/minimatch
[Contribution Guide]: ./CONTRIBUTING.md
