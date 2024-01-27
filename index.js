import express from "express"
import uniqid from 'uniqid'

const app = express()

const posts = []

app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))

app.get('/', (req, res) => {
    const title = 'Home'
    res.render('index.ejs', {title})
})

app.get('/posts/:id', (req, res) => {
    const title = 'Pizda blyad'
    const post = posts.find( ({id}) => id === req.params['id'] )
    res.render('post.ejs', { title, post })
})

app.get('/posts', (req, res) => {
    const title = 'Posts'
    const reversePosts = [...posts].reverse()
    res.render('posts.ejs', { title, posts:reversePosts })
})

app.get('/new', (req, res) => {
    const title = 'New post'
    res.render('new.ejs', { title })
})

app.get('/contacts', (req, res) => {
    const title = 'Contacts'
    const contacts = [
        { name: 'YouTube', link: 'https://www.youtube.com/channel/UCwWzx5QwXcSdsG7Fu4sebnQ'},
        { name: 'FaceBook', link: 'https://www.facebook.com/vitaly.tkachuk.92?locale=ru_RU'}
    ]
    res.render('contacts.ejs', { contacts, title })
})

app.post('/new', (req, res) => {
    const {title, author, textarea} = req.body
    const post = {
        id: uniqid(),
        date: new Date(),
        title,
        author,
        text: textarea
    }
    posts.push(post)
    res.render('post.ejs', {title, post})
})

app.use((req, res) => {
    const title = 'Error page'
    res
       .status(404)
       .render('error.ejs', { title })
}) 

app.listen(3000, () => {
    console.log('Server running on port 3000');
})