import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div style={{ paddingLeft: '30px' }}>
      <Link to="/one-way/">One Way</Link>
    </div>
  </Layout>
)

export default IndexPage
