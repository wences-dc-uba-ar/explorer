const jsYaml = require(`js-yaml`)

exports.createPages = async ({ actions, graphql }) => {
    const { createPage } = actions
    const { data } = await graphql(`
        query MyQuery {
            allFile(filter: { sourceInstanceName: { eq: "ast" }, internal: { mediaType: { eq: "text/yaml" } } }) {
                edges {
                    node {
                        name
                        relativeDirectory
                        ext
                    }
                }
            }
        }
    `)

    createPage({
        path: '/using-dsg',
        component: require.resolve('./src/templates/using-dsg.js'),
        context: {},
        defer: true,
    })

    data.allFile.edges.forEach(edge => {
        const path = edge.node.relativeDirectory + '/' + edge.node.name
        actions.createPage({
            path: path,
            component: require.resolve(`./src/templates/ClassPage.js`),
            context: {
                name: edge.node.name,
                relativeDirectory: edge.node.relativeDirectory,
            },
        })
    })
}

async function onCreateNode({ node, actions, loadNodeContent, createNodeId, createContentDigest }) {
    const { createNode, createParentChildLink } = actions

    if (node.internal.mediaType !== `text/yaml`) {
        return
    }

    function transformObject(obj, id, type) {
        const yamlNode = {
            ...obj,
            id,
            children: [],
            parent: node.id,
            internal: {
                contentDigest: createContentDigest(obj),
                type,
            },
        }
        createNode(yamlNode)
        createParentChildLink({ parent: node, child: yamlNode })
    }

    const content = await loadNodeContent(node)
    const parsedContent = jsYaml.load(content)

    transformObject(parsedContent, node.id + '-yaml', 'php_class')
}

exports.onCreateNode = onCreateNode
