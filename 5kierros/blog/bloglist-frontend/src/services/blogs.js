import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const like = async (blogObject, blogId) => {
  const address = `${baseUrl}/${blogId}`
  const response = await axios.put(address, blogObject)
  console.log('response data', response.data)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('config',config)
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  console.log('response', response.data)
  return response.data
}

export default { getAll, create, setToken, like, remove }