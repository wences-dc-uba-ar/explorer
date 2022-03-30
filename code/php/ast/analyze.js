'use strict'
var fs = require('fs')
const { result } = require('lodash')
var path = require('path')

const log = (data, filesSuffix = '', overwrite = true, ext = '.log') => {
    let filename = path.basename(__filename, path.extname(__filename)) + filesSuffix + ext
    if (overwrite) {
        data = JSON.stringify(data, null, 4)
        filename += '.json'
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

const report = {
    namespace: null,
    class: null,
    parent: null,
    interfaces: [''],
    constants: [{ name: '', type: '' }],
    properties: [
        {
            name: '',
            type: '',
            privacy: null,
        },
    ],
    methods: [
        {
            name: '',
            arguments: [{ name: '', type: null }],
            returnType: null,
            privacy: null,
            abstract: false,
            static: false,
        },
    ],
}

const proc = {}

proc.default = node => {
    if (Array.isArray(node)) {
        const lista = []
        node.forEach(childNode => {
            lista.push(analyze(childNode))
        })
        return lista
    } else if (isIterable(node) || typeof node === 'object') {
        const result = {}
        Object.keys(node).forEach(key => {
            result[key] = analyze(node[key])
        })
        return result
    } else {
        log(node, '-no-iterable', true)
        return node
    }
}

proc.class = node => {
    const result = {
        classes: node.name.name,
    }
    return result
}

proc.program = node => {
    const result = {
        classes: [],
        errors: node.errors,
    }
    analyze(node.children).forEach(child => {
        if (child.classes) {
            result.classes.push(child.classes)
            delete child.classes
        }
        if (child != {}) {
            result.TODO = result.TODO || []
            result.TODO.push(child)
        }
    })
    return result
}

const isIterable = thing => {
    return thing !== null && thing !== undefined && typeof thing[Symbol.iterator] === 'function'
}

const analyze = node => {
    if (typeof node !== 'object' || node === null) {
        return node
    }
    if (node.kind && typeof proc[node.kind] === 'function') {
        return proc[node.kind](node)
    }
    if (!node.kind && !Array.isArray(node)) {
        log(node, '-no-kind', false)
    }
    return proc.default(node)
}

exports.analyze = analyze
