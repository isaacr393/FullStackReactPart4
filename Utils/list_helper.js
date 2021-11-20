const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((prev, blog) => {
    return Number(prev) + Number(blog.likes)
},0)

const favorite = (blogs) => blogs.reduce((prev, blog) => {
    return blog.likes > prev.likes? blog:prev
})

module.exports = {
    dummy,
    totalLikes,
    favorite,
}