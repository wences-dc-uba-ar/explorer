'use strict'
var fs = require('fs')
var path = require('path')

const log = (data, filesSuffix = '', overwrite = true) => {
    const filename = `transform${filesSuffix}.log`
    if (overwrite) {
        data = JSON.stringify(data, null, 4)
        fs.writeFile(filename, data, function (err) {
            if (err) throw err
        })
    } else {
        data = JSON.stringify(data)
        fs.appendFile(filename, `${data}\n`, function (err) {
            if (err) throw err
        })
    }
}

const stats = token => { }

const simple = {}
simple.default = node => {
    // node = renameKey(node, 'kind', 'k')
    // node = renameKey(node, 'name', 'n')
    // node = renameKey(node, 'type', 't')
    // node = renameKey(node, 'items', 'i')
    node = renameKey(node, 'children', 'c')
    node = recurseCollection(node)
    if (node.body) {
        node = recurseCollection(node, 'body')
    }
    node = deleteNulls(node)
    return node
}

const deleteNulls = node => {
    if (isIterable(node)) {
        const result = {}
        for (const key of node) {
            if (node[key] !== null) {
                result[key] = node[key]
            }
        }
        return result
    } else {
        log(node, '-no-iterable')
        return node
    }
}

const isIterable = thing => {
    if (thing === null || thing === undefined) {
        return false
    }
    return typeof thing[Symbol.iterator] === 'function'
}

const recurseCollection = (node, collectionKey = 'c', callback = simplify) => {
    const newCollection = []
    if (node[collectionKey]) {
        if (isIterable(node[collectionKey])) {
            node[collectionKey].forEach(childNode => {
                newCollection.push(callback(childNode))
            })
        } else {
            log(node[collectionKey], '-no-iterable-ck')
        }
    }
    if (newCollection) {
        node[collectionKey] = newCollection
    }
    return node
}

const renameKey = (obj, oldKey, newKey, deleteNull = true) => {
    if (obj[oldKey] !== null || !deleteNull) {
        obj[newKey] = obj[oldKey]
        delete obj[oldKey]
    }
    return obj
}

const simplify = node => {
    if (node.kind && typeof simple[node.kind] === 'function') {
        return simple[node.kind](node)
    } else if (!node.kind) {
        log(node, '-no-kind')
    } else {
        log(node.kind)
    }
    return simple.default(node)
}

exports.simplify = simplify
