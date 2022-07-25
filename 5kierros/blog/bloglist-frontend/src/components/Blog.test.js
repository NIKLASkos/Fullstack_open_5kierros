import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    author: '123',
    id: '62dbab9d126d3fad871dae83',
    title: 'test',
    url: 'qwe',
    user:
      {
        id:'62d678ec6173b641033a1151',
        username: 'niklas'
      }
  }
  const user = {
    'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pa2xhcyIsImlkIjoiNjJkNjc4ZWM2MTczYjY0MTAzM2ExMTUxIiwiaWF0IjoxNjU4NTcxMDQxfQ.qIXguZEvs05yAK-P_jqCWYLe7ZuZmZSWdemhOEVE6M4',
    'username':'niklas',
    'name':'Superuser' }
  window.localStorage.setItem('user', JSON.stringify(user))


  render(<Blog blog={blog} />)

  const element = screen.getByText('test 123')
  expect(element).toBeDefined()
  const urlElement = screen.queryByText('URL: qwe')
  expect(urlElement).toBeNull()
})

test('renders likes and url after expanding blog', async () => {
  const blog = {
    author: '123',
    id: '62dbab9d126d3fad871dae83',
    title: 'test',
    url: 'qwe',
    user: '62d678ec6173b641033a1151',
  }

  render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)
  screen.getByText('URL: qwe')
  screen.getByText('Likes: 0')
  screen.debug()
})

test('like button is pressed two times', async () => {
  const blog = {
    author: '123',
    id: '62dbab9d126d3fad871dae83',
    title: 'test',
    url: 'qwe',
    user: '62d678ec6173b641033a1151',
  }
  const likePress = jest.fn()

  render(<Blog blog={blog} handleLikeClick={likePress} />)
  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(likePress.mock.calls).toHaveLength(2)
  screen.debug()
})