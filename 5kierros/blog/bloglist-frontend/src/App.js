import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/Blogform'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [addBlogVisible, setAddBlogVisible] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs => {
      //blogs with no likes to the end of the array so they do not disturb sorting
      for (let index = 0; index < blogs.length; index++) {
        if (blogs[index].likes === undefined) {
          blogs.push(blogs.splice(index, 1)[0])
        }
      }
      //sort blogs in ascending order by likes
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

      console.log('sorted', sortedBlogs)
      setBlogs( sortedBlogs )
    }
    )
  }, [])

  useEffect(() => {
    const localStorageUser = window.localStorage.getItem('user')
    if (localStorageUser) {
      const userInJson = JSON.parse(localStorageUser)
      setUser(userInJson)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('user', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Logged in successfully')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = (event) => {
    event.preventDefault()
    localStorage.removeItem('user')
    setUser(null)
    setSuccessMessage('Logged out successfully')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 2000)
  }

  const notifications = () => {
    if (errorMessage !== null && successMessage !== null) {
      return(
        <div>
          <p className="error">{errorMessage}</p>
          <p className="success">{successMessage}</p>
        </div>
      )
    }
    else if (errorMessage !== null) return <p className="error">{errorMessage}</p>
    else if (successMessage !==null) return <p className="success">{successMessage}</p>
  }

  if (user === null) {
    return (
      <div>
        {notifications()}
        <h2>Login</h2>
        <div>
          <form onSubmit={handleLogin}>
            <div>Username :
              <input
                id='username'
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}>
              </input>
            </div>
            <div>Password :
              <input
                id='password'
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}>
              </input>
            </div>
            <button type="submit" id='loginbutton'>Login</button>
          </form>
        </div>
      </div>
    )
  }

  const createBlog = async (blogObject) => {
    blogService.setToken(user.token)
    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
    setSuccessMessage(`A new blog added: ${blogObject.title} by ${blogObject.author}`)
    setTimeout( () => {
      setSuccessMessage(null)
    }, 4000)
  }

  const blogForm = () => {
    const hideWhenVisible = { display: addBlogVisible ? 'none' : '' }
    const showWhenVisible = { display: addBlogVisible ? '' : 'none' }

    return(
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setAddBlogVisible(true)}>Add a new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            createBlog={createBlog}
          />
          <button onClick={() => setAddBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notifications()}
      <p>{user.name} is logged in.</p>
      <button onClick={handleLogOut}>Log out</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <br></br>
      {blogForm()}
    </div>
  )
}

export default App
