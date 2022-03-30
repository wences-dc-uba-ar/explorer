import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

const ClassPage = ({ pageContext, data }) => {
    console.log(pageContext)
    console.log(data)
    return (
        <Layout pageTitle='My Blog Posts'>
            <ul>
                {/* {data.allFile.nodes.map(node => (
                    <li key={node.name}>{node.name}</li>
                ))} */}
            </ul>
        </Layout>
    )
}
export const query = graphql`
    query ($name: String!, $relativeDirectory: String!) {
        file(name: { eq: $name }, relativeDirectory: { eq: $relativeDirectory }) {
            absolutePath
        }
    }
`
export default ClassPage
