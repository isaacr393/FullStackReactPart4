const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((prev, blog) => {
    return Number(prev) + Number(blog.likes)
},0)



module.exports = {
    dummy,
    totalLikes,
}