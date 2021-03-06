const _ = require('lodash');

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((prev, blog) => {
    return Number(prev) + Number(blog.likes)
},0)

const favorite = (blogs) => blogs.reduce((prev, blog) => {
    return blog.likes > prev.likes? blog:prev
})

const mostBlogs = ( blogs ) => {
    let grouped = _.groupBy(blogs, 'author');
    return Object.keys(grouped).reduce( (prev, key) => {
        if( prev.blogs < grouped[key].length )
        return { author: key, blogs: grouped[key].length }
        else
        return prev
    }, {author: 'None', blogs: 0 })
}

const mostLikes = ( blogs ) => {
    let grouped = _.groupBy(blogs, 'author');
    return Object.keys(grouped).reduce( (prev, key) => {
        let totalLikes = grouped[key].reduce( (prev, current) => prev + current.likes, 0 )
        if( prev.likes < totalLikes  )
        return { author: key, likes: totalLikes }
        else
        return prev
    }, {author: 'None', likes: 0 })
}

module.exports = {
    dummy,
    totalLikes,
    favorite,
    mostBlogs,
    mostLikes
}