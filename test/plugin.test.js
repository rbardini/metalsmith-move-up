var moveUp = require('../lib/plugin'),
    tape = require('tape'),
    lodash = require('lodash')

var filesMock = {
  'index.js': {},
  'posts/one.md': {},
  'posts/two.md': {},
  'lib/js/index.js': {},
  'bin/.git/.gitignore': {}
}

var metalsmithMock = {}

tape('By default, all files and directories are moved up one', function (test) {
  var testFiles = lodash.cloneDeep(filesMock),
      metalsmith = lodash.cloneDeep(metalsmithMock)

  test.plan(5)
  moveUp()(testFiles, metalsmith, function () {
    test.ok(testFiles['index.js'])
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['js/index.js'])
    test.ok(testFiles['.git/.gitignore'])
  })
})

tape('Files are moved not copied', function (test) {
  var testFiles = lodash.cloneDeep(filesMock),
      metalsmith = lodash.cloneDeep(metalsmithMock)

  test.plan(8)
  moveUp()(testFiles, metalsmith, function () {
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['js/index.js'])
    test.ok(testFiles['.git/.gitignore'])

    test.notOk(testFiles['posts/one.md'])
    test.notOk(testFiles['posts/two.md'])
    test.notOk(testFiles['lib/js/index.js'])
    test.notOk(testFiles['bin/.git/.gitignore'])
  })
})

tape('custom options are supported', function (test) {
  var testFiles = lodash.cloneDeep(filesMock),
      metalsmith = lodash.cloneDeep(metalsmithMock),
      pattern = {
        pattern: 'bin/.git/.gitignore',
        by: 2
      }

  test.plan(5)
  moveUp(pattern)(testFiles, metalsmith, function () {
    test.ok(testFiles['.gitignore'])
    test.ok(testFiles['posts/one.md'])
    test.ok(testFiles['posts/two.md'])
    test.ok(testFiles['lib/js/index.js'])

    test.notOk(testFiles['bin/.git/.gitignore'])
  })
})

tape('multiple options are supported', function (test) {
  var testFiles = lodash.cloneDeep(filesMock),
      metalsmith = lodash.cloneDeep(metalsmithMock),
      patternOne = {
        pattern: 'bin/.git/.gitignore',
        by: 2
      },
      patternTwo = {
        pattern: 'posts/*',
        by: 2
      }

  test.plan(6)
  moveUp(patternOne, patternTwo)(testFiles, metalsmith, function () {
    test.ok(testFiles['.gitignore'])
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])

    test.notOk(testFiles['bin/.git/.gitignore'])
    test.notOk(testFiles['posts/one.md'])
    test.notOk(testFiles['posts/two.md'])
  })
})
