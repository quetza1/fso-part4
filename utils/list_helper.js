const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map((blog) => blog.likes).reduce((acc, cur) => acc + cur, 0)
}

module.exports = {
  dummy,
  totalLikes,
}
