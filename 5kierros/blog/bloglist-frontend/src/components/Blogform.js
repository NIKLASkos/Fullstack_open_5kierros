import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
                    Title:
          <input
            id='title'
            value={newTitle}
            onChange={handleTitleChange}
            placeholder='title'>
          </input>
        </div>
        <div>
                    Author:
          <input
            id='author'
            value={newAuthor}
            onChange={handleAuthorChange}
            placeholder='author'>
          </input>
        </div>
        <div>
                    URL:
          <input
            id='url'
            value={newUrl}
            onChange={handleUrlChange}
            placeholder='url'>
          </input>
        </div>
        <button id='blogsubmit' type="subit" >Add blog</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm