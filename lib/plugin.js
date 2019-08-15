'use strict'

const multimatch = require('multimatch') // for glob matching the search pattern
const async = require('async') // for filtering and enumerating files
const path = require('path')

const normalizeInput = transforms => {
  const normalizedTransforms = []
  const defaultTransform = {
    pattern: '**',
    by: 1,
    opts: {
      dot: true
    }
  }

  // we'll need this to normalize individual transforms
  const addTransform = transform => {
    normalizedTransforms.push(Object.assign({}, defaultTransform, transform))
    return normalizedTransforms
  }

  const addTransforms = transforms => {
    transforms.forEach(transform => {
      if (typeof transform === 'string') addTransform({ pattern: transform })
      else addTransform(transform)
    })
  }

  // if we got nothing we will just add a single default and return
  if (!transforms) return addTransform({})

  // single string simple transforms
  if (typeof transforms === 'string') return addTransform({ pattern: transforms })

  // if we have an array, add each to normalizedTransforms
  if (Array.isArray(transforms)) {
    addTransforms(transforms)

    return normalizedTransforms
  }

  // An object can be a number of things
  if (typeof transforms === 'object') {
    // if we don't have .transforms then we have a single transform
    if (!transforms.transforms) return addTransform(transforms)

    // if we have default options use those instead
    if (transforms.opts) defaultTransform.opts = transforms.opts

    // loop through and add the inner transforms
    addTransforms(Object.values(transforms.transforms))
  }

  return normalizedTransforms
}

module.exports = transforms => {
  transforms = normalizeInput(transforms)

  // metalsmith expects a function to be returned
  return (files, _metalsmith, callback) => {
    // will be called once per transform
    const onNextTransform = (transform, next) => {
      // check if we should handle this filePath
      const shouldProcess = (filePath, done) => {
        done(null, !!multimatch(filePath, transform.pattern, transform.opts).length)
      }

      // transform the path
      const process = (filePath, complete) => {
        const filename = path.basename(filePath)
        let pathParts = path.dirname(filePath).split(path.sep)

        // we'll get an empty arrary if we overslice
        pathParts = pathParts.slice(transform.by)
        pathParts.push(filename)

        const newPath = pathParts.join(path.sep)
        const fileData = files[filePath]

        // don't need the old fileData anymore,
        // since we are re-adding with the new path
        delete files[filePath]
        files[newPath] = fileData

        complete()
      }

      // we do this for each option as the last may have modified the collection
      async.filter(Object.keys(files), shouldProcess, (_err, results) => {
        async.each(results, process, next)
      })
    }

    // looping the optionsStore kicks off the proccess
    async.each(transforms, onNextTransform, callback)
  }
}
