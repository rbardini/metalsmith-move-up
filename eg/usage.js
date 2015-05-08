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
