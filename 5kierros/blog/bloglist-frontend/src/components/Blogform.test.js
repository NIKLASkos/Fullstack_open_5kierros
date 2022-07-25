import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blogform from './Blogform'

test('renders content', async () => {

  const mockHandler = jest.fn()

  render(<Blogform createBlog={mockHandler} />)

  const user = userEvent.setup()
  const sendButton = screen.getByText('Add blog')
  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  await userEvent.type(titleInput, 'testi_title')
  await userEvent.type(urlInput, 'testi_url')
  await userEvent.type(authorInput, 'testi_author')


  await user.click(sendButton)
  console.log('mock call', mockHandler.mock.calls)
  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('testi_title')
  expect(mockHandler.mock.calls[0][0].author).toBe('testi_author')
  expect(mockHandler.mock.calls[0][0].url).toBe('testi_url')
})
