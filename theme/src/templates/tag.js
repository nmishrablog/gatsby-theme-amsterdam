import React from 'react'
import { graphql } from 'gatsby'
import Intro from '../components/Intro'
import PostList from '../components/PostList'
import SEO from '../components/SEO'
import Pagination from '../components/Pagination'
import Container from '../components/Container'

const TagPage = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <>
      <SEO
        title={`Tag: ${pageContext.tag}`}
        image={posts[0].node.frontmatter.cover.childImageSharp.ogimg.src}
      />
      <Container fullWidth noPadding>
        <Intro title={`Tagged: ${pageContext.tag}`} context={pageContext} />
        <PostList posts={posts} grid={pageContext.grid} />
      </Container>
      <Pagination context={pageContext} />
    </>
  )
}

export default TagPage

export const tagQuery = graphql`
  query($skip: Int!, $limit: Int!, $tag: String) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            cover {
              childImageSharp {
                fluid(maxWidth: 1000) {
                  ...GatsbyImageSharpFluid_withWebp
                }
                ogimg: resize(width: 1000) {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`
