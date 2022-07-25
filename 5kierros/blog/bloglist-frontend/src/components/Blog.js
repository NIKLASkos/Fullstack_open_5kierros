import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, handleLikeClick }) => {
  const [expandedBlog, setExpanded] = useState(false)
  if (!blog.likes) blog.likes = 0
  const [likes, setLikes] = useState(blog.likes)
  const userToken = JSON.parse(window.localStorage.getItem('user')).token

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const correctUser = JSON.parse(window.localStorage.user).username === blog.user.username
    ? true
    : false
  const displayIfCorrectUser = { display: correctUser ? '' : 'none' }
  console.log('user', JSON.parse(window.localStorage.user).username, blog.user.username)

  const displayWhenExpanded = { ...blogStyle,
    display: expandedBlog ? '' : 'none'
  }

  const hideWhenExpanded = { ...blogStyle,
    display: expandedBlog ? 'none' : ''
  }

  const handleLike = async (event) => {
    event.preventDefault()
    setLikes(likes + 1)
    await blogService.like({
      user: blog.user.id,
      likes: likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }, blog.id)
  }

  const handleRemove = async (event) => {
    try {
      event.preventDefault()
      console.log('blogid', blog.id)
      console.log('bloguser', blog.user)
      blogService.setToken(userToken)
      //if (window.confirm(`Delete ${blog.title}?`)){
      await blogService.remove(blog.id)
      //}
    } catch (exception) {
      window.alert('You are not authorized to delete this blog. Please login again.')
    }
  }


  if (!expandedBlog) {
    return (
      <div id={blog.title} style={hideWhenExpanded} className='blog'>
        {blog.title} {blog.author} <button onClick={() => setExpanded(true)}>View</button>
      </div>
    )
  }

  return(
    <div style={displayWhenExpanded}>
      <div>Title: {blog.title}
        <button onClick={() => setExpanded(false)}>Hide</button>
      </div>
      <div>Author: {blog.author}</div>
      <div>URL: {blog.url}</div>
      <div>Likes: {likes} <button id='likebutton' onClick={handleLikeClick || handleLike}>Like</button></div>
      <div>Submitted by: {blog.user.name}</div>
      <button id='deletebutton' style={displayIfCorrectUser} onClick={handleRemove}>Remove</button>
    </div>
  )}

export default Blog