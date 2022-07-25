const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./a_test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const api = supertest(app)
    
beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('deleted')
    await Blog.insertMany(helper.initialBlogs)
    console.log('inserted', helper.initialBlogs.length)
    
    const newUser = {
      username: 'newUser',
      name: 'new user',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    authorization = {
      Authorization: `bearer ${result.body.token}`,
    }
  })


test('blogs returned as json', async() => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('content-type', /application\/json/)
})

test('id is found', async() => {
    const response = await api.get('/api/blogs')
    console.log('response ', response.body.map(blog => blog.id))

    expect(response.body.forEach(blog => expect(blog.id).toBeDefined()))
})

test('can post blogs', async () => {
    const newBlog = {
        _id: "5a422bc61b54a676234d17fd",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0,
        userId: "62cffafd65447e83f31a7da9"
    }
    await api
    .post('/api/blogs')
    .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vZGVsIiwiaWQiOiI2MmQ2YWQ5MjQwMzhkZGFmODFiZGVjOTciLCJpYXQiOjE2NTgyMzYzMjJ9.vV_3sJqBPN7LkG0KfGRbGgswBwAQfY2JWXnNxJAxdiY')
    .send(newBlog)
    
    .expect(201)
    .expect('content-type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body
    console.log('response body', blogs)
    console.log('length ^^ ', blogs.length)
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
})

test('blog without likes-content should have 0 likes', async() => {
    const newBlog = {
        //_id: "5a422bc61b54a676234d17fd",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        __v: 0,
        userId: "62cffafd65447e83f31a7da9"
    }
    console.log('added blog', newBlog)

    await api
    .post('/api/blogs')
    .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vZGVsIiwiaWQiOiI2MmQ2YWQ5MjQwMzhkZGFmODFiZGVjOTciLCJpYXQiOjE2NTgyMzYzMjJ9.vV_3sJqBPN7LkG0KfGRbGgswBwAQfY2JWXnNxJAxdiY')
    .send(newBlog)
    .expect(201)
    .expect('content-type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body
    expect(blogs.forEach(blog => expect(blog.likes).toBeDefined()))
})

test('posting blog without title or url', async () => {
    const newBlog = {
        _id: "5a422bc61b54a676234d17fe",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        __v: 0
    }
    await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('username must be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
  })

afterAll(() => {
    mongoose.connection.close()
})