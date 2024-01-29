import express from "express"
import mongoose from 'mongoose'
import methodOverride from 'method-override'

const app = express()


// mondoose conect
mongoose.connect('mongodb+srv://Vitalii:pass123@cluster0.ieuemxw.mongodb.net/node-blog')

const contactsSchema = new mongoose.Schema({
    name: String,
    link: String
})

// const userModel = mongoose.model('contacts', new mongoose.Schema({name:String, link:String})) // varianr of typing
const ContactsModel = mongoose.model('contacts', contactsSchema) // variant with variable in arguments

const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    text: String,
}, {timestamps: true})

const PostModel = mongoose.model('posts', postSchema)


app.use(express.urlencoded({ extended: true })) // to parse data from inputs on page via req.body

app.use(express.static('public')) // to conect static files like css from public folder

app.use(methodOverride('_method'))


// routes
app.get('/', (req, res) => {
    const title = 'Home'
    res.render('index.ejs', {title})
})

app.get('/posts/:id', (req, res) => {
    PostModel
        .findById(req.params.id)
        .then(data => res.render('post.ejs', { post: data, title: data.title }))
        .catch(error => console.log(error))
})

app.get('/edit/:id', (req, res) => {
    const title = 'Edit post'
    PostModel
        .findById(req.params.id)
        .then(data => {
            res.render('edit.ejs', { post: data, title: title })
        })
        .catch(error => console.log(error))
})

app.put('/edit/:id', (req, res) => {
    const { title, author, textarea } = req.body
    const { id } = req.params
    PostModel
        .findByIdAndUpdate(id, { title: title, author: author, text: textarea })
        .then(data => res.redirect(`/posts/${id}`))
        .catch(error => console.log(error))
})

app.delete('/posts/:id', (req, res) => {
    PostModel
        .findByIdAndDelete(req.params.id)
        .then(data => res.sendStatus(200))
        .catch(error => {
            console.log(error)
            res.render('error.ejs', { title: 'error' })
        })
})

app.get('/posts', (req, res) => {
    const title = 'Posts'
    PostModel
        .find()
        .sort({ createdAt: -1 })
        .then(data => res.render('posts.ejs', { title: title, posts: data }))
        .catch(error => console.log(error))
})

app.get('/new', (req, res) => {
    const title = 'New post'
    res.render('new.ejs', { title: title })
})

app.get('/contacts', (req, res) => {
    const title = 'Contacts'
    ContactsModel
        .find()
        .then(data => {res.render('contacts.ejs', { title: title, contacts: data } ) })
        .catch(err => console.log(err))
})

app.post('/new', (req, res) => {
    const {title, author, textarea} = req.body
    const post = new PostModel({ title: title, author: author, text:textarea })
    post
        .save()
        .then(result => res.redirect('/posts'))
        .catch(error => console.log(error))
})


app.use((req, res) => {
    const title = 'Error page'
    res
       .status(404)
       .render('error.ejs', { title: title })
}) 


// create server and listen port
app.listen(3000, () => {
    console.log('Server running on port 3000');
})