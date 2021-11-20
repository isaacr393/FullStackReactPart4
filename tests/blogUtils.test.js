const functionsToTest = require('../Utils/list_helper')

const blogs = [
    {
        title: "Second app",
        Author: "Isaac",
        url: "thisisfakeurl.com",
        likes: "10"
    },
    {
        title: "Fourt app",
        Author: "Genesis",
        url: "thisisfakeurl.com",
        likes: "12"
    },
]

describe('Blog utilities', ()=> {

    test('Dummy Function', () => {
        let returnValue = functionsToTest.dummy(blogs)
    
        expect(returnValue).toBe(1)
    })

    test('Total likes', () => {
        let returnValue = functionsToTest.totalLikes(blogs)
    
        expect(returnValue).toBe(22)
    })
})