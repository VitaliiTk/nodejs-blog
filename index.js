import express from "express"
import uniqid from 'uniqid'
import mongoose from 'mongoose'

const app = express()


// mondoose conect
mongoose.connect('mongodb+srv://Vitalii:pass123@cluster0.ieuemxw.mongodb.net/node-blog')

const contactsSchema = new mongoose.Schema({
    name: String,
    link: String
})

// const userModel = mongoose.model('contacts', new mongoose.Schema({name:String, link:String})) // varianr of typing
const contactsModel = mongoose.model('contacts', contactsSchema) // variant with variable in arguments

const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    text: String
})

const postModel = mongoose.model('posts', postSchema)


const posts = [] // array for added posts

app.use(express.urlencoded({ extended: true })) // to parse data from inputs on page via req.body

app.use(express.static('public')) // to conect static files like css from public folder


// routes
app.get('/', (req, res) => {
    const title = 'Home'
    res.render('index.ejs', {title})
})

app.get('/posts/:id', (req, res) => {
    const post = posts.find( ({id}) => id === req.params['id'] )
    res.render('post.ejs', { post })
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

    // take data from database
    contactsModel
        .find()
        .then(data => {res.render('contacts.ejs', { title: title, contacts: data })})
        .catch(err => console.log(err))
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
    // res.render('post.ejs', {title, post})
    res.redirect('/posts')
})

app.use((req, res) => {
    const title = 'Error page'
    res
       .status(404)
       .render('error.ejs', { title })
}) 


// create server and listen port
app.listen(3000, () => {
    console.log('Server running on port 3000');
})