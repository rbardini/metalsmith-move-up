const moveUp = require('../lib/plugin')
const tape = require('tape')

const getFilesMock = () => ({
  'index.js': {},
  'posts/one.md': {},
  'posts/two.md': {},
  'posts/~draft.md': {},
  'lib/js/index.js': {},
  'bin/.git/.gitignore': {}
})

const getMetalsmithMock = () => ({})

tape('By default, all files and directories are moved up one', test => {
  const testFiles = getFilesMock()
  const metalsmith = getMetalsmithMock()

  test.plan(6)
  moveUp()(testFiles, metalsmith, () => {
    test.ok(testFiles['index.js'])
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['~draft.md'])
    test.ok(testFiles['js/index.js'])
    test.ok(testFiles['.git/.gitignore'])
  })
})

tape('string input is supported', test => {
  const testFiles = getFilesMock()
  const metalsmith = getMetalsmithMock()

  test.plan(6)
  moveUp('**')(testFiles, metalsmith, () => {
    test.ok(testFiles['index.js'])
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['~draft.md'])
    test.ok(testFiles['js/index.js'])
    test.ok(testFiles['.git/.gitignore'])
  })
})

tape('Files are moved not copied', test => {
  const testFiles = getFilesMock()
  const metalsmith = getMetalsmithMock()

  test.plan(10)
  moveUp()(testFiles, metalsmith, () => {
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['~draft.md'])
    test.ok(testFiles['js/index.js'])
    test.ok(testFiles['.git/.gitignore'])

    test.notOk(testFiles['posts/one.md'])
    test.notOk(testFiles['posts/two.md'])
    test.notOk(testFiles['posts/~draft.md'])
    test.notOk(testFiles['lib/js/index.js'])
    test.notOk(testFiles['bin/.git/.gitignore'])
  })
})

tape('Simple transforms are supported', test => {
  const testFiles = getFilesMock()
  const metalsmith = getMetalsmithMock()
  const transforms = [
    'posts/*',
    'lib/**'
  ]

  test.plan(9)
  moveUp(transforms)(testFiles, metalsmith, () => {
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['~draft.md'])
    test.ok(testFiles['js/index.js'])
    test.ok(testFiles['bin/.git/.gitignore'])

    test.notOk(testFiles['posts/one.md'])
    test.notOk(testFiles['posts/two.md'])
    test.notOk(testFiles['posts/~draft.md'])
    test.notOk(testFiles['lib/js/index.js'])
  })
})

tape('custom transforms are supported', test => {
  const testFiles = getFilesMock()
  const metalsmith = getMetalsmithMock()
  const transform = {
    pattern: 'bin/.git/.gitignore',
    by: 2
  }

  test.plan(6)
  moveUp(transform)(testFiles, metalsmith, () => {
    test.ok(testFiles['.gitignore'])
    test.ok(testFiles['posts/one.md'])
    test.ok(testFiles['posts/two.md'])
    test.ok(testFiles['posts/~draft.md'])
    test.ok(testFiles['lib/js/index.js'])

    test.notOk(testFiles['bin/.git/.gitignore'])
  })
})

tape('custom minimatch options are supported', test => {
  const testFiles = getFilesMock()
  const metalsmith = getMetalsmithMock()
  const transforms = {
    opts: {
      dot: false
    },
    transforms: {
      pattern: '**',
      by: 2
    }
  }

  test.plan(5)
  moveUp(transforms)(testFiles, metalsmith, () => {
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['~draft.md'])
    test.ok(testFiles['index.js'])
    test.ok(testFiles['bin/.git/.gitignore'])
  })
})

tape('multiple transforms are supported', test => {
  const testFiles = getFilesMock()
  const metalsmith = getMetalsmithMock()
  const transformOne = {
    pattern: 'bin/.git/.gitignore',
    by: 2
  }
  const transformTwo = {
    pattern: 'posts/*',
    by: 2
  }

  test.plan(8)
  moveUp([transformOne, transformTwo])(testFiles, metalsmith, () => {
    test.ok(testFiles['.gitignore'])
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['~draft.md'])

    test.notOk(testFiles['bin/.git/.gitignore'])
    test.notOk(testFiles['posts/one.md'])
    test.notOk(testFiles['posts/two.md'])
    test.notOk(testFiles['posts/~draft.md'])
  })
})

tape('custom minimatch options with multiple transforms are supported', test => {
  const testFiles = getFilesMock()
  const metalsmith = getMetalsmithMock()
  const transformOne = {
    pattern: 'bin/**',
    by: 2
  }
  const transformTwo = {
    pattern: 'posts/*',
    by: 2
  }
  const transforms = {
    opts: {
      dot: false
    },
    transforms: [transformOne, transformTwo]
  }

  test.plan(8)
  moveUp(transforms)(testFiles, metalsmith, () => {
    test.ok(testFiles['bin/.git/.gitignore'])
    test.ok(testFiles['one.md'])
    test.ok(testFiles['two.md'])
    test.ok(testFiles['~draft.md'])

    test.notOk(testFiles['.gitignore'])
    test.notOk(testFiles['posts/one.md'])
    test.notOk(testFiles['posts/two.md'])
    test.notOk(testFiles['posts/~draft.md'])
  })
})
