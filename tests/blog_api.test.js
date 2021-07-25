const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'new Blog',
    author: 'random blogger',
    url: 'https://blog.com/new-blog',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const title = blogsAtEnd.map((n) => n.title)
  expect(title).toContain('new Blog')
  const author = blogsAtEnd.map((n) => n.author)
  expect(author).toContain('random blogger')
  const url = blogsAtEnd.map((n) => n.url)
  expect(url).toContain('https://blog.com/new-blog')
})

afterAll(() => {
  mongoose.connection.close()
})
