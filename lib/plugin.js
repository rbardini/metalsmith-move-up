'use strict'

var multimatch = require('multimatch'),    // for glob matching the search pattern
    async = require('async'),              // for filtering and enumerating files
    lodash = require('lodash'),            // for merging custom options with defaults
    path = require('path')                 // for path manipulation

module.exports = function moveUp () {
  var optionsStore = [],
      defaults = {
        pattern: '',    // by default wont do anything
        by: 1
      }

  // arguments is not a real array, lets make one
  lodash.each(arguments, function (pattern) {
    optionsStore.push(lodash.merge({}, defaults, pattern))
  })

  // add a move all by default no user options exist
  if (optionsStore.length === 0) {
    optionsStore.push(lodash.merge({}, defaults, {pattern: '**'}))
  }

  // metalsmith expects a function to be returned
  return function (files, metalsmith, callback) {
    function onNextOptions (options, next) {
      var matchOptions = {
        dot: true
      }

      function shouldProcess (filePath, done) {
        done(!!multimatch(filePath, options.pattern, matchOptions).length)
      }

      function process (filePath, complete) {
        var filename = path.basename(filePath),
            pathParts = path.dirname(filePath).split(path.sep)

        // we'll get an empty arrary if we overslice
        pathParts = pathParts.slice(options.by)
        pathParts.push(filename)

        var newPath = pathParts.join(path.sep),
            fileData = files[filePath]

        // don't need the old fileData anymore,
        // since we are re-adding with the new path
        delete files[filePath]
        files[newPath] = fileData

        complete()
      }

      // we do this for each option as the last may have modified the collection
      async.filter(Object.keys(files), shouldProcess, function (results) {
        async.each(results, process, next)
      })
    }

    // looping the optionsStore kicks off the proccess
    async.each(optionsStore, onNextOptions, callback)
  }
}
