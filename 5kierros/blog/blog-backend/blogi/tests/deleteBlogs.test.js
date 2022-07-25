const supertest = require('supertest')
const helper = require('./a_test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('deletion of a blog', () => {
    
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
      })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      console.log('blog to delete', blogToDelete)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)
      console.log('titles', titles)

      expect(titles).not.toContain(blogToDelete.title)
    })
  })