import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

const HEAD = ({ pageDescription, pageTitle, pageAuthor }) => {
  const { title, description, author, lang } = useSiteMetadata()

  const metaTitle = pageTitle || title
  const metaDescription = pageDescription || description
  const metaAuthor = pageAuthor || author

  return (
    <Helmet titleTemplate={`%s | ${metaTitle}`} defaultTitle={title}>
      <html lang={lang} />
      <body />
      <meta name="description" content={metaDescription} />
      <meta name="author" content={metaAuthor} />
      {/* approach from gatsby documentation workaround 2 https://www.gatsbyjs.org/docs/using-client-side-only-packages/ */}
      {/* <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script> */}
      {/* TODO - Add default metaData and logic for page overrides */}
    </Helmet>
  )
}

HEAD.propTypes = {
  pageDescription: PropTypes.string,
  pageAuthor: PropTypes.string,
  // meta: PropTypes.arrayOf(PropTypes.object),
  pageTitle: PropTypes.string
}

export default HEAD