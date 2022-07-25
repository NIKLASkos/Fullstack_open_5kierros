const { indexOf } = require('lodash')
const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce(
        (sum, blog) => sum + blog.likes,
         0)
}

const favouriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    console.log('returned blog', blogs.find(blog => blog.likes === maxLikes))
    return blogs.find(blog => blog.likes === maxLikes)
}

const writerWithMostBlogs = (blogs) => {
    
    const mostCommonWriter = _.head(_(blogs)
    .countBy('author')
    .entries()
    .maxBy(_.last))

    const amountOfBlogs = _.last(
        Object.values(
            _.countBy(blogs, 'author')
            ))

    return {
        author: mostCommonWriter,
        blogs: amountOfBlogs
    }
}

const authorWithMostLikes = (blogs) => {
    const writersGrouped = Object.entries(_.groupBy(blogs, 'author'))
    console.log('writers grouped', writersGrouped)
    const likesForAuthors = writersGrouped
        .map( author => author[1]
            .map(blog => blog.likes)
            )

    const sumOfLikes = likesForAuthors
        .map(authorLikes => _.sum(authorLikes))
    const maxLikes = _.max(sumOfLikes)
    const authorOfMaxLikes = writersGrouped[_.indexOf(sumOfLikes, maxLikes)][0]
    console.log('likes for authors', likesForAuthors)
    console.log('sum of likes', sumOfLikes)
    console.log('author', authorOfMaxLikes)
    return {
        author: authorOfMaxLikes,
        likes: maxLikes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    writerWithMostBlogs,
    authorWithMostLikes
}