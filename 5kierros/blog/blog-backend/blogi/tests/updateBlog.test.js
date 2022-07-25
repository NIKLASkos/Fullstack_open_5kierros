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
      const blogToUpdate = blogsAtStart[0]
      console.log('blog to update', blogToUpdate)
      const likesBeforeUpdate = blogToUpdate.likes

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )

      expect(blogsAtEnd[0].likes).toBe(likesBeforeUpdate + 1)
    })
  })