'use strict'

var fs = require('fs')
var path = require('path')
var engine = require('php-parser')
var jsYaml = require('js-yaml')

var { simplify } = require('./transform.js')
var { analyze } = require('./analyze.js')

var parser = new engine({
    ast: { withPositions: false },
    parser: {
        debug: false,
        locations: false,
        extractDoc: false,
        suppressErrors: false,
        php7: true,
    },
    lexer: {
        all_tokens: false,
        comment_tokens: false,
        mode_eval: false,
        asp_tags: false,
        short_tags: false,
    },
})

async function* walk(in_dir = '.php', out_dir = '.ast') {
    for await (const item of await fs.promises.opendir(in_dir)) {
        const entry = path.join(in_dir, item.name)
        const outro = path.join(out_dir, item.name)
        if (item.isDirectory()) {
            yield* await walk(entry, outro)
        } else if (item.isFile()) {
            yield [entry, outro]
        }
    }
}

const subdir = 'module/application/defaultconfig'
const in_dir = '.src/' + subdir
const out_dir = '.ast/' + subdir
    ; (async () => {
        for await (const [inFile, outFile] of walk(in_dir, out_dir)) {
            if (inFile.match(/.+\.php$/)) {
                const outYAML = outFile.replace(/.[^.]+$/, '.yaml')
                const outJSON = outFile.replace(/.[^.]+$/, '.json')
                // if (!fs.existsSync(outYAML)) {
                let ast = parser.parseCode(fs.readFileSync(inFile))
                saveFile(outJSON, JSON.stringify(ast, null, 4))
                // ast = simplify(ast)
                // saveFile(outYAML, jsYaml.dump(ast))
                ast = JSON.parse(JSON.stringify(ast, null, 2))
                const insight = analyze(ast)
                saveFile(outYAML, jsYaml.dump(insight))
                // }
            }
        }
    })()

function saveFile(filename, data) {
    const dirname = path.dirname(filename)
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true })
    }
    fs.writeFile(filename, data, err => {
        if (err) {
            console.log(err)
        }
    })
}
